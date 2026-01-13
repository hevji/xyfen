import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music2, ArrowLeft, Download, Disc3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/config";

/**
 * Extract YouTube Music track ID from various URL formats
 */
const extractMusicId = (input: string): string | null => {
  // Clean the input
  const trimmed = input.trim();
  
  // Direct ID format (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // YouTube Music URL patterns
  const patterns = [
    /music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
};

/**
 * Music Page - YouTube Music MP3 Downloader
 */
const Music = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const musicId = extractMusicId(url);
    
    if (!musicId) {
      setError("Please enter a valid YouTube Music URL or track ID");
      toast({
        title: "Invalid Input",
        description: "Please enter a valid YouTube Music URL or track ID.",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    // Navigate to download with musicId
    navigate(`/music/download?musicId=${musicId}`);
  };

  /**
   * Handle direct download
   */
  const handleDirectDownload = () => {
    const musicId = extractMusicId(url);
    
    if (!musicId) {
      setError("Please enter a valid YouTube Music URL or track ID");
      toast({
        title: "Invalid Input",
        description: "Please enter a valid YouTube Music URL or track ID.",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    // Direct download via API
    window.location.href = `${API_URL}/api/music/download?musicId=${musicId}`;
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-accent/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        {/* Music-specific floating orbs */}
        <div className="absolute top-1/3 left-20 w-40 h-40 bg-primary/15 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 right-16 w-28 h-28 bg-accent/12 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <Header />

      <main className="relative pt-28 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-3xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          {/* Hero Section */}
          <section className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground animate-fade-in">
              <Disc3 className="w-4 h-4 text-primary animate-spin-slow" />
              <span>MP3 Downloads</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              YouTube Music
              <span className="block gradient-text glow-text mt-2">MP3 Downloader</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Download any YouTube Music track as high-quality MP3.
              Just paste the URL or track ID.
            </p>
          </section>

          {/* Input Section */}
          <section className="mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`relative glass-strong rounded-2xl p-2 transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 shadow-glow' : ''}`}>
                <div className="flex items-center gap-3 px-4">
                  <Music2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Paste YouTube Music URL or track ID..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-4 font-mono"
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isLoading || !url.trim()}
                  className="gap-2"
                >
                  <Music2 className="w-5 h-5" />
                  Get Track Info
                </Button>
                <Button
                  type="button"
                  variant="glass"
                  size="lg"
                  disabled={isLoading || !url.trim()}
                  onClick={handleDirectDownload}
                  className="gap-2"
                >
                  <Download className="w-5 h-5" />
                  Direct Download
                </Button>
              </div>
            </form>
          </section>

          {/* Info Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="glass rounded-2xl p-6 space-y-3 interactive-card">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold">High Quality MP3</h3>
              <p className="text-muted-foreground text-sm">
                Downloads are converted to high-quality 320kbps MP3 format with proper metadata.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 space-y-3 interactive-card">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                <Disc3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold">Any Track</h3>
              <p className="text-muted-foreground text-sm">
                Works with any YouTube Music track, album song, or playlist item.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Music;
