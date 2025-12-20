import { useState } from "react";
import { Link, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

/**
 * UrlInput Component
 * Handles YouTube URL input with validation
 * Features a clean design with icon and animated button
 */
const UrlInput = ({ onSubmit, isLoading }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  // Validate YouTube URL format
  const validateUrl = (input: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/;
    return youtubeRegex.test(input);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL before submitting
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-3">
      {/* Input container with glass effect */}
      <div className="relative glass-strong rounded-xl p-2 shadow-glow">
        <div className="flex items-center gap-2">
          {/* URL Icon */}
          <div className="pl-3">
            <Link className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* URL Input */}
          <Input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(""); // Clear error on input
            }}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base"
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Fetch Video</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm px-2 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
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
