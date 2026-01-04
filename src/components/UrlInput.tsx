import { useState, useEffect, useRef } from "react";
import { Link, Search, AlertCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Turnstile site key - replace with your own
const TURNSTILE_SITE_KEY = "0x4AAAAAACKQbzrFcssFcdii";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

/**
 * UrlInput Component
 * Handles YouTube URL input with validation and Turnstile verification
 */
const UrlInput = ({ onSubmit, isLoading }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Load Turnstile script
  useEffect(() => {
    if (document.getElementById('turnstile-script')) {
      setTurnstileLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'turnstile-script';
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.onload = () => setTurnstileLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Render Turnstile widget when shown
  useEffect(() => {
    if (showTurnstile && turnstileLoaded && turnstileRef.current && window.turnstile && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          setTurnstileToken(token);
        },
        'expired-callback': () => {
          setTurnstileToken(null);
        },
        theme: 'dark',
      });
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [showTurnstile, turnstileLoaded]);

  // Validate YouTube URL format
  const validateUrl = (input: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    return youtubeRegex.test(input);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL before showing Turnstile
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    // Show Turnstile if not yet verified
    if (!turnstileToken) {
      setShowTurnstile(true);
      return;
    }

    // Submit with verified token
    onSubmit(url);
    
    // Reset after submission
    setShowTurnstile(false);
    setTurnstileToken(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      {/* Input container with glass effect */}
      <div 
        className={`relative glass-strong rounded-2xl p-2 transition-all duration-500 ${
          isFocused 
            ? 'shadow-glow-lg ring-2 ring-primary/30' 
            : 'shadow-glow'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* URL Icon */}
          <div className="pl-4">
            <Link className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>

          {/* URL Input */}
          <Input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
              // Reset turnstile if URL changes
              if (showTurnstile) {
                setShowTurnstile(false);
                setTurnstileToken(null);
                if (widgetIdRef.current && window.turnstile) {
                  window.turnstile.remove(widgetIdRef.current);
                  widgetIdRef.current = null;
                }
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base h-12 placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isLoading || (showTurnstile && !turnstileToken)}
            className="shrink-0 gap-2 py-4 sm:py-5 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Fetch Video</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Turnstile widget */}
      {showTurnstile && (
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <p className="text-sm text-muted-foreground">Please verify you're human</p>
          <div ref={turnstileRef} className="flex justify-center" />
          {turnstileToken && (
            <p className="text-sm text-green-500">✓ Verified! Click "Fetch Video" to continue</p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center justify-center gap-2 text-destructive text-sm px-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Helper text */}
      <p className="text-center text-muted-foreground text-sm">
        Supports YouTube videos, shorts, and playlists
      </p>
    </form>
  );
};

export default UrlInput;
