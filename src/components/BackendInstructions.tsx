import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * BackendInstructions Component
 * Shows users how to set up the Python Flask backend
 * Includes copy-to-clipboard functionality for code snippets
 */
const BackendInstructions = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pythonCode = `# backend.py - Flask Backend for YouTube Downloader
# Run with: python backend.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

def validate_youtube_url(url):
    """Validate that the URL is a valid YouTube URL"""
    youtube_regex = r'^(https?://)?(www\\.)?(youtube\\.com/(watch\\?v=|embed/|v/)|youtu\\.be/)[a-zA-Z0-9_-]{11}'
    return bool(re.match(youtube_regex, url))

def format_duration(seconds):
    """Convert seconds to MM:SS or HH:MM:SS format"""
    if not seconds:
        return "Unknown"
    hours, remainder = divmod(int(seconds), 3600)
    minutes, secs = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"

def format_views(views):
    """Format view count with K/M suffix"""
    if not views:
        return "Unknown"
    if views >= 1_000_000:
        return f"{views / 1_000_000:.1f}M views"
    if views >= 1_000:
        return f"{views / 1_000:.1f}K views"
    return f"{views} views"

@app.route('/api/fetch', methods=['POST'])
def fetch_video():
    """Fetch video metadata from YouTube URL"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        # Validate URL
        if not url or not validate_youtube_url(url):
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # Configure yt-dlp options
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract available formats
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
            
            # Sort formats by quality
            formats.sort(key=lambda x: int(x['quality'].replace('p', '')), reverse=True)
            
            return jsonify({
                'title': info.get('title', 'Unknown'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': format_duration(info.get('duration')),
                'views': format_views(info.get('view_count')),
                'channel': info.get('uploader', 'Unknown'),
                'formats': formats[:4]  # Return top 4 quality options
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    """Initiate video download (returns download instructions)"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        quality = data.get('quality', '720p')
        
        if not url or not validate_youtube_url(url):
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # For now, return a message - actual download would be implemented
        return jsonify({
            'message': f'Download started for {quality}',
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask server on http://localhost:5000")
    print("📡 Frontend should connect to this URL")
    app.run(debug=True, port=5000)`;

  const requirementsCode = `flask
flask-cors
yt-dlp`;

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Terminal className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">Backend Setup</h3>
          <p className="text-muted-foreground text-sm">Run the Python Flask server locally</p>
        </div>
      </div>

      {/* Step 1: Install dependencies */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">1. Create requirements.txt</h4>
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

      {/* Step 2: Install */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">2. Install packages</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <code>pip install -r requirements.txt</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard("pip install -r requirements.txt", "pip")}
          >
            {copied === "pip" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Step 3: Create backend.py */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">3. Create backend.py</h4>
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

      {/* Step 4: Run */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">4. Run the server</h4>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <code>python backend.py</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard("python backend.py", "run")}
          >
            {copied === "run" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        The server will run on <code className="text-primary">http://localhost:5000</code>. 
        Use ngrok for public access: <code className="text-primary">ngrok http 5000</code>
      </p>
    </div>
  );
};

export default BackendInstructions;
