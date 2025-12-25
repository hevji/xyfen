import { useNavigate } from "react-router-dom";
import { Sparkles, Shield, Zap, Settings, Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlInput from "@/components/UrlInput";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/**
 * Extract YouTube video ID from various URL formats
 */
const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Index Page - Main Xyfen YouTube Downloader Interface
 */
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Handle URL submission - extract video ID and navigate to download page
   */
  const handleFetchVideo = (url: string) => {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/download?videoId=${videoId}`);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-pulse-slow" />
        {/* Secondary glow */}
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-accent/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <Header />

      {/* Main Content */}
      <main className="relative pt-28 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <section className="text-center space-y-8 mb-14">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground animate-fade-in">
              <Flame className="w-4 h-4 text-primary" />
              <span>Free & Open Source</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Download YouTube Videos
              <span className="block gradient-text glow-text mt-2">Fast & Free</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Enter any YouTube URL to get video info and download in your preferred quality.
              No ads, no limits, just pure simplicity.
            </p>
          </section>

          {/* URL Input Section */}
          <section className="mb-14 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <UrlInput onSubmit={handleFetchVideo} isLoading={false} />
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
            <div className="glass rounded-2xl p-7 text-center space-y-4 animate-fade-in interactive-card" style={{ animationDelay: "0.4s" }}>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Fetch video info in seconds with optimized processing
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
              <h3 className="font-display font-semibold text-lg">Multiple Formats</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Download in 360p to 4K, audio-only, and more
              </p>
            </div>
          </section>

          {/* Backend Setup Link */}
          <section className="text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Button
              variant="glass"
              onClick={() => navigate("/backend-setup")}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Backend Setup
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;