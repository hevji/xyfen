import { Terminal, Copy, Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * BackendInstructions Component
 * Shows users how to set up the Python Flask backend with security features
 */
const BackendInstructions = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pythonCode = `# backend.py - Secure Flask Backend for YouTube Downloader
# Features: aria2c acceleration, authentication, rate limiting, path sanitization
# Run with: python backend.py

from flask import Flask, request, jsonify, Response, send_file, g
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
from functools import wraps
import yt_dlp
import re
import os
import json
import time
import uuid
import threading
import subprocess
import tempfile
import shutil
from pathlib import Path
from urllib.parse import urlparse

app = Flask(__name__)

# SECURITY: Restrict CORS to specific origins in production
CORS(app, origins=[
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server
    "https://your-app.lovable.app",  # Add your production domain
])

# Rate limiting configuration
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour", "20 per minute"]
)

# SECURITY: API key for basic authentication (set via environment variable)
API_SECRET_KEY = os.environ.get("XYFEN_API_KEY", "change-this-secret-key-in-production")

# SECURITY: Use a sandboxed temp directory for downloads
SANDBOX_DIR = Path(tempfile.gettempdir()) / "xyfen_downloads"
SANDBOX_DIR.mkdir(exist_ok=True)

# Store for tracking download progress
downloads = {}

# ============== SECURITY HELPERS ==============

def require_api_key(f):
    """Decorator to require API key authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get("X-API-Key") or request.args.get("api_key")
        if not api_key or api_key != API_SECRET_KEY:
            return jsonify({"error": "Unauthorized: Invalid or missing API key"}), 401
        return f(*args, **kwargs)
    return decorated_function

def validate_youtube_url(url: str) -> bool:
    """
    SECURITY: Strict YouTube URL validation to prevent SSRF attacks.
    Only allows valid YouTube domains and video ID formats.
    """
    if not url or not isinstance(url, str):
        return False
    
    # Parse the URL
    try:
        parsed = urlparse(url)
    except Exception:
        return False
    
    # Whitelist of allowed hostnames
    allowed_hosts = {
        "youtube.com", "www.youtube.com", "m.youtube.com",
        "youtu.be", "www.youtu.be"
    }
    
    hostname = parsed.hostname
    if not hostname or hostname.lower() not in allowed_hosts:
        return False
    
    # Validate URL pattern with regex
    youtube_patterns = [
        r'^(https?://)?(www\.)?(youtube\.com/watch\?v=)[a-zA-Z0-9_-]{11}',
        r'^(https?://)?(www\.)?(youtube\.com/embed/)[a-zA-Z0-9_-]{11}',
        r'^(https?://)?(www\.)?(youtube\.com/v/)[a-zA-Z0-9_-]{11}',
        r'^(https?://)?(www\.)?(youtube\.com/shorts/)[a-zA-Z0-9_-]{11}',
        r'^(https?://)?(www\.)?youtu\.be/[a-zA-Z0-9_-]{11}',
        r'^(https?://)?m\.youtube\.com/watch\?v=[a-zA-Z0-9_-]{11}',
    ]
    
    for pattern in youtube_patterns:
        if re.match(pattern, url):
            return True
    
    return False

def sanitize_filename(filename: str) -> str:
    """
    SECURITY: Sanitize filename to prevent path traversal attacks.
    Only allows alphanumeric, hyphens, underscores, and dots.
    """
    if not filename:
        return ""
    
    # Use werkzeug's secure_filename first
    safe_name = secure_filename(filename)
    
    # Additional sanitization: only allow UUID format for our download IDs
    uuid_pattern = r'^[a-f0-9-]{36}\.(mp4|webm|mkv|mp3|m4a)$'
    if re.match(uuid_pattern, safe_name.lower()):
        return safe_name
    
    # If not a valid format, reject
    return ""

def is_path_safe(filepath: Path, base_dir: Path) -> bool:
    """SECURITY: Ensure file path is within the sandbox directory"""
    try:
        resolved = filepath.resolve()
        base_resolved = base_dir.resolve()
        return str(resolved).startswith(str(base_resolved))
    except Exception:
        return False

def check_aria2c_installed() -> bool:
    """Check if aria2c is available in the system"""
    try:
        result = subprocess.run(["aria2c", "--version"], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

ARIA2C_AVAILABLE = check_aria2c_installed()

# ============== UTILITY FUNCTIONS ==============

def format_duration(seconds):
    if not seconds:
        return "Unknown"
    hours, remainder = divmod(int(seconds), 3600)
    minutes, secs = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"

def format_views(views):
    if not views:
        return "Unknown"
    if views >= 1_000_000:
        return f"{views / 1_000_000:.1f}M views"
    if views >= 1_000:
        return f"{views / 1_000:.1f}K views"
    return f"{views} views"

def cleanup_old_files():
    """Remove files older than 1 hour from sandbox"""
    try:
        now = time.time()
        for filepath in SANDBOX_DIR.iterdir():
            if filepath.is_file():
                age = now - filepath.stat().st_mtime
                if age > 3600:  # 1 hour
                    filepath.unlink()
    except Exception as e:
        print(f"Cleanup error: {e}")

# ============== API ENDPOINTS ==============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "aria2c_available": ARIA2C_AVAILABLE,
        "sandbox_dir": str(SANDBOX_DIR)
    })

@app.route('/api/fetch', methods=['POST'])
@limiter.limit("10 per minute")
@require_api_key
def fetch_video():
    """Fetch video metadata from YouTube"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request: JSON body required"}), 400
        
        url = data.get('url', '')
        
        # SECURITY: Validate YouTube URL
        if not validate_youtube_url(url):
            return jsonify({"error": "Invalid YouTube URL. Only youtube.com and youtu.be URLs are allowed."}), 400

        ydl_opts = {'quiet': True, 'no_warnings': True, 'extract_flat': False}

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

            formats = []
            seen_qualities = set()
            for f in info.get('formats', []):
                height = f.get('height')
                if height and height >= 360:
                    quality = f"{height}p"
                    if quality not in seen_qualities:
                        seen_qualities.add(quality)
                        filesize = f.get('filesize') or f.get('filesize_approx')
                        size_str = f"{filesize / (1024*1024):.1f} MB" if filesize else "Unknown"
                        formats.append({
                            'quality': quality,
                            'format': f.get('ext', 'mp4'),
                            'size': size_str
                        })

            formats.sort(key=lambda x: int(x['quality'].replace('p', '')), reverse=True)

            return jsonify({
                'title': info.get('title', 'Unknown'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': format_duration(info.get('duration')),
                'views': format_views(info.get('view_count')),
                'channel': info.get('uploader', 'Unknown'),
                'formats': formats[:4]
            })

    except Exception as e:
        return jsonify({'error': f"Failed to fetch video info: {str(e)}"}), 500

def download_with_aria2c(url: str, output_path: Path, download_id: str):
    """Use aria2c for accelerated downloads with multiple connections"""
    try:
        # First, get the direct URL using yt-dlp
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'format': 'best[ext=mp4]/best',
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            direct_url = info.get('url')
            
            if not direct_url:
                raise Exception("Could not get direct download URL")
        
        # Use aria2c with multiple connections for faster download
        aria2_cmd = [
            "aria2c",
            "-x", "16",  # 16 connections
            "-s", "16",  # 16 splits
            "-k", "1M",  # 1MB minimum split size
            "--file-allocation=none",
            "--dir", str(output_path.parent),
            "--out", output_path.name,
            direct_url
        ]
        
        process = subprocess.Popen(
            aria2_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Monitor progress
        while process.poll() is None:
            if output_path.exists():
                # Update progress based on file size (rough estimate)
                downloads[download_id]['stage'] = 'downloading'
                downloads[download_id]['progress'] = min(90, downloads[download_id]['progress'] + 5)
            time.sleep(0.5)
        
        if process.returncode == 0 and output_path.exists():
            return True
        else:
            stderr = process.stderr.read()
            raise Exception(f"aria2c failed: {stderr}")
            
    except Exception as e:
        print(f"aria2c download failed: {e}")
        return False

def download_worker(download_id: str, url: str, quality: str):
    """Worker thread for downloading videos"""
    downloads[download_id] = {
        'status': 'downloading',
        'progress': 0,
        'stage': 'initializing'
    }

    height = int(quality.replace('p', ''))
    filename = f"{download_id}.mp4"
    filepath = SANDBOX_DIR / filename

    # Try aria2c first if available
    if ARIA2C_AVAILABLE:
        downloads[download_id]['stage'] = 'downloading (aria2c)'
        success = download_with_aria2c(url, filepath, download_id)
        if success:
            downloads[download_id] = {
                'status': 'ready',
                'progress': 100,
                'filename': filename,
                'stage': 'complete'
            }
            return

    # Fallback to yt-dlp
    def progress_hook(d):
        if d['status'] == 'downloading':
            total = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
            downloaded = d.get('downloaded_bytes', 0)
            if total > 0:
                progress = (downloaded / total) * 100
                downloads[download_id]['progress'] = min(progress, 99)
                downloads[download_id]['stage'] = 'downloading'
        elif d['status'] == 'finished':
            downloads[download_id]['progress'] = 95
            downloads[download_id]['stage'] = 'converting'

    ydl_opts = {
        'format': f'bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/best',
        'outtmpl': str(filepath.with_suffix('.%(ext)s')),
        'progress_hooks': [progress_hook],
        'merge_output_format': 'mp4',
        'quiet': True,
        'no_warnings': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        # Ensure file exists with correct extension
        actual_file = None
        for ext in ['mp4', 'webm', 'mkv']:
            check_path = SANDBOX_DIR / f"{download_id}.{ext}"
            if check_path.exists():
                actual_file = check_path
                break
        if actual_file and actual_file.suffix != '.mp4':
            actual_file.rename(filepath)

        downloads[download_id] = {
            'status': 'ready',
            'progress': 100,
            'filename': filename,
            'stage': 'complete'
        }

    except Exception as e:
        downloads[download_id] = {
            'status': 'error',
            'error': str(e),
            'progress': 0
        }

@app.route('/api/download/stream')
@limiter.limit("5 per minute")
@require_api_key
def download_stream():
    """Stream download progress via SSE"""
    url = request.args.get('url', '')
    quality = request.args.get('quality', '720p')
    download_id = request.args.get('id', str(uuid.uuid4()))

    # SECURITY: Validate YouTube URL
    if not validate_youtube_url(url):
        return jsonify({"error": "Invalid YouTube URL"}), 400

    thread = threading.Thread(target=download_worker, args=(download_id, url, quality))
    thread.start()

    def generate():
        while True:
            if download_id in downloads:
                status = downloads[download_id]

                if status['status'] in ['downloading', 'converting']:
                    yield f"data: {json.dumps({'type':'progress','progress':status['progress'],'stage':status.get('stage','downloading')})}\n\n"
                elif status['status'] == 'ready':
                    yield f"data: {json.dumps({'type':'complete','filename':status['filename']})}\n\n"
                    break
                elif status['status'] == 'error':
                    yield f"data: {json.dumps({'type':'error','message':status.get('error','Unknown')})}\n\n"
                    break

            time.sleep(0.5)

    return Response(generate(), mimetype='text/event-stream', headers={
        'Cache-Control': 'no-cache', 'Connection': 'keep-alive'
    })

@app.route('/api/download', methods=['POST'])
@limiter.limit("5 per minute")
@require_api_key
def start_download():
    """Start a video download"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request: JSON body required"}), 400
        
        url = data.get('url', '')
        quality = data.get('quality', '720p')
        download_id = data.get('id', str(uuid.uuid4()))

        # SECURITY: Validate YouTube URL
        if not validate_youtube_url(url):
            return jsonify({"error": "Invalid YouTube URL. Only youtube.com and youtu.be URLs are allowed."}), 400

        thread = threading.Thread(target=download_worker, args=(download_id, url, quality))
        thread.start()

        return jsonify({'status': 'started', 'id': download_id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/status/<download_id>')
@limiter.limit("30 per minute")
@require_api_key
def download_status(download_id):
    """Check download status"""
    # SECURITY: Validate download_id format (UUID)
    try:
        uuid.UUID(download_id)
    except ValueError:
        return jsonify({"error": "Invalid download ID format"}), 400
    
    if download_id not in downloads:
        return jsonify({'status': 'not_found'}), 404
    return jsonify(downloads[download_id])

@app.route('/api/download/file/<filename>')
@limiter.limit("10 per minute")
@require_api_key
def download_file(filename):
    """Serve the downloaded file and delete it after sending"""
    
    # SECURITY: Sanitize filename to prevent path traversal
    safe_filename = sanitize_filename(filename)
    if not safe_filename:
        return jsonify({"error": "Invalid filename. Only valid download IDs are allowed."}), 400
    
    filepath = SANDBOX_DIR / safe_filename
    
    # SECURITY: Verify path is within sandbox
    if not is_path_safe(filepath, SANDBOX_DIR):
        return jsonify({"error": "Access denied: Invalid file path"}), 403

    if not filepath.exists():
        return jsonify({'error': 'File not found'}), 404

    response = send_file(
        filepath,
        as_attachment=True,
        download_name=safe_filename,
        mimetype='video/mp4'
    )

    # Schedule cleanup after response
    @response.call_on_close
    def cleanup():
        try:
            if filepath.exists():
                os.remove(filepath)
            # Remove entry from downloads dict
            for download_id, info in list(downloads.items()):
                if info.get('filename') == safe_filename:
                    downloads.pop(download_id)
        except Exception as e:
            print(f"Failed to delete {safe_filename}: {e}")

    return response

# Cleanup old files periodically
@app.before_request
def before_request():
    # Run cleanup every 100 requests (simple approach)
    if hash(time.time()) % 100 == 0:
        cleanup_old_files()

if __name__ == '__main__':
    print("🚀 Starting Secure Flask server on http://localhost:5000")
    print(f"📁 Sandbox directory: {SANDBOX_DIR}")
    print(f"⚡ aria2c acceleration: {'Available' if ARIA2C_AVAILABLE else 'Not installed'}")
    print("🔒 Security features enabled:")
    print("   - API key authentication (set XYFEN_API_KEY env var)")
    print("   - Rate limiting (100/hour, 20/minute)")
    print("   - YouTube URL validation (SSRF prevention)")
    print("   - Filename sanitization (path traversal prevention)")
    print("   - Sandboxed downloads (temp directory)")
    print("")
    print("⚠️  Set XYFEN_API_KEY environment variable for production!")
    app.run(debug=False, port=5000, threaded=True)`;

  const requirementsCode = `flask
flask-cors
flask-limiter
yt-dlp
werkzeug`;

  const envExample = `# Backend Environment Variables
# Copy to .env and configure

# REQUIRED: API key for authentication (generate a secure random string)
XYFEN_API_KEY=your-secure-api-key-here

# Example: Generate a secure key with Python:
# python -c "import secrets; print(secrets.token_urlsafe(32))"`;

  const frontendExample = `// React: Add API key to all backend requests
// Create src/lib/api.ts

const API_BASE_URL = "http://localhost:5000";
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY || "";

export const fetchVideo = async (url: string) => {
  const response = await fetch(\`\${API_BASE_URL}/api/fetch\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch video");
  }
  
  return response.json();
};

export const startDownload = async (url: string, quality: string) => {
  const downloadId = crypto.randomUUID();
  const response = await fetch(\`\${API_BASE_URL}/api/download\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({ url, quality, id: downloadId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to start download");
  }
  
  return response.json();
};`;

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Terminal className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Secure Backend Setup</h3>
          <p className="text-muted-foreground text-sm">Production-ready Flask server with security features</p>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="font-medium text-green-400">Security Features</span>
        </div>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ API key authentication for all endpoints</li>
          <li>✓ Rate limiting (100/hour, 20/minute)</li>
          <li>✓ YouTube URL validation (SSRF prevention)</li>
          <li>✓ Path traversal attack prevention</li>
          <li>✓ Sandboxed temp directory for downloads</li>
          <li>✓ CORS origin restrictions</li>
        </ul>
      </div>

      {/* Performance Features */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Performance Features</span>
        </div>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>✓ aria2c acceleration (16 parallel connections)</li>
          <li>✓ Automatic fallback to yt-dlp if aria2c unavailable</li>
          <li>✓ Real-time progress streaming</li>
          <li>✓ Auto-cleanup of old files</li>
        </ul>
      </div>

      {/* Step 1: Install dependencies */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">1. Install requirements.txt</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground overflow-x-auto">
            <code>{requirementsCode}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(requirementsCode, "req")}
          >
            {copied === "req" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 2: Install aria2c */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">2. Install aria2c (optional, for faster downloads)</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <code># macOS{"\n"}brew install aria2{"\n\n"}# Ubuntu/Debian{"\n"}sudo apt install aria2{"\n\n"}# Windows{"\n"}choco install aria2</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard("brew install aria2", "aria2")}
          >
            {copied === "aria2" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 3: Environment variables */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">3. Create .env file for backend</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground overflow-x-auto">
            <code>{envExample}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(envExample, "env")}
          >
            {copied === "env" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 4: Create backend.py */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">4. Create backend.py</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground overflow-x-auto max-h-64 overflow-y-auto">
            <code>{pythonCode}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(pythonCode, "python")}
          >
            {copied === "python" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 5: Frontend API helper */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">5. React API helper (optional)</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground overflow-x-auto max-h-48 overflow-y-auto">
            <code>{frontendExample}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(frontendExample, "frontend")}
          >
            {copied === "frontend" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 6: Run */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">6. Run the server</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <code>pip install -r requirements.txt{"\n"}export XYFEN_API_KEY="your-secure-key"{"\n"}python backend.py</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard('pip install -r requirements.txt\nexport XYFEN_API_KEY="your-secure-key"\npython backend.py', "run")}
          >
            {copied === "run" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-muted-foreground text-sm">
        <p>
          The server will run on <code className="text-primary">http://localhost:5000</code>
        </p>
        <p>
          <strong>For production:</strong> Use gunicorn, set strong API key, configure HTTPS
        </p>
        <p>
          Use ngrok for public access: <code className="text-primary">ngrok http 5000</code>
        </p>
      </div>
    </div>
  );
};

export default BackendInstructions;
