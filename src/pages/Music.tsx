import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music2, Flame, Sparkles, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/**
 * Extract video ID from YouTube Music URLs
 */
const extractMusicVideoId = (input: string): string | null => {
  const trimmed = input.trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    if (host.includes("music.youtube.com") || host.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("?")[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch {}

  const patterns = [
    /music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }

  return null;
};

const Music = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchMusic = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractMusicVideoId(url);

    console.log("[Music] URL:", url);
    console.log("[Music] Video ID:", videoId);

    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Enter a valid YouTube Music link or video ID.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/music/download?videoId=${videoId}`);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-accent/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <Header />

      <main className="relative pt-28 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* Hero */}
          <section className="text-center space-y-8 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground animate-fade-in">
              <Flame className="w-4 h-4 text-primary" />
              <span>MP3 Downloads</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              YouTube Music
              <span className="block gradient-text glow-text mt-2">MP3 Downloader</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Download any YouTube Music track as high-quality MP3. Paste the URL and hit fetch.
            </p>
          </section>

          {/* Input Section */}
          <section className="mb-14 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <form onSubmit={handleFetchMusic} className="space-y-4">
              <div className={`relative glass-strong rounded-2xl p-2 transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 shadow-glow' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 px-4 flex-1">
                    <Music2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Paste YouTube Music URL..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-4 font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={isLoading || !url.trim()}
                    className="flex-none mr-2 px-8 py-3 text-lg font-semibold rounded-xl"
                  >
                    <Music2 className="w-5 h-5 mr-2" />
                    Fetch Music
                  </Button>
                </div>
              </div>
              <p className="text-center text-muted-foreground/70 text-sm">
                Supports: music.youtube.com, youtube.com, youtu.be links
              </p>
            </form>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
            <div className="glass rounded-2xl p-7 text-center space-y-4 animate-fade-in interactive-card" style={{ animationDelay: "0.4s" }}>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">High Quality</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                320kbps MP3 with proper metadata and album art
              </p>
            </div>
            <div className="glass rounded-2xl p-7 text-center space-y-4 animate-fade-in interactive-card" style={{ animationDelay: "0.5s" }}>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Safe & Secure</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No data collection, runs entirely on your machine
              </p>
            </div>
            <div className="glass rounded-2xl p-7 text-center space-y-4 animate-fade-in interactive-card" style={{ animationDelay: "0.6s" }}>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Any Track</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Works with any YouTube Music song, album, or playlist item
              </p>
            </div>
          </section>

          {/* Back Button */}
          <section className="text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Button
              variant="glass"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              ← Back to Video Downloader
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Music;
