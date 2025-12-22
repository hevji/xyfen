import { useState } from "react";
import { Sparkles, Shield, Zap, Settings, Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlInput from "@/components/UrlInput";
import VideoCard from "@/components/VideoCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import BackendInstructions from "@/components/BackendInstructions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDownload } from "@/hooks/useDownload";

// Video metadata interface
interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
  formats: Array<{
    quality: string;
    format: string;
    size: string;
  }>;
}

// API endpoint - change this to your Flask backend URL
const API_URL = "http://localhost:5000";

/**
 * Index Page - Main Xyfen YouTube Downloader Interface
 */
const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();
  
  const {
    downloads,
    startDownload,
    downloadFile,
    retryDownload,
    getActiveDownload,
  } = useDownload({ apiUrl: API_URL });

  /**
   * Fetch video information from the backend
   */
  const handleFetchVideo = async (url: string) => {
    setIsLoading(true);
    setVideoInfo(null);
    setCurrentUrl(url);

    try {
      const response = await fetch(`${API_URL}/api/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch video info");
      }

      const data = await response.json();
      setVideoInfo(data);
      toast({
        title: "Video found!",
        description: "Select a quality to download.",
      });
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Connection Error",
        description: "Make sure the Flask backend is running on localhost:5000",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle video download request
   */
  const handleDownload = (quality: string, includeTitle: boolean): string => {
    toast({
      title: "Download Started",
      description: `Starting ${quality} download...`,
    });
    
    const downloadId = `${Date.now()}-${quality}`;
    startDownload(currentUrl, quality, includeTitle);
    return downloadId;
  };

  /**
   * Handle retry for failed downloads
   */
  const handleRetry = (downloadId: string) => {
    retryDownload(downloadId, currentUrl);
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
            <UrlInput onSubmit={handleFetchVideo} isLoading={isLoading} />
          </section>

          {/* Loading State */}
          {isLoading && (
            <section className="mb-14">
              <LoadingSpinner />
            </section>
          )}

          {/* Video Info Display */}
          {videoInfo && !isLoading && (
            <section className="mb-14">
              <VideoCard
                video={videoInfo}
                onDownload={handleDownload}
                downloads={downloads}
                onDownloadFile={downloadFile}
                onRetry={handleRetry}
                getActiveDownload={getActiveDownload}
              />
            </section>
          )}

          {/* Features Grid */}
          {!videoInfo && !isLoading && (
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
          )}

          {/* Backend Setup Toggle */}
          <section className="text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Button
              variant="glass"
              onClick={() => setShowInstructions(!showInstructions)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              {showInstructions ? "Hide" : "Show"} Backend Setup
            </Button>
          </section>

          {/* Backend Instructions */}
          {showInstructions && (
            <section className="mt-10 animate-fade-in">
              <BackendInstructions />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;