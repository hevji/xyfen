import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Music2, ArrowLeft, Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/config";

interface TrackInfo {
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  album?: string;
}

/**
 * Music Download Page - Fetch track info and download as MP3
 */
const MusicDownload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const musicId = searchParams.get("musicId");
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState(false);

  /**
   * Validate music ID format
   */
  const isValidMusicId = (id: string | null): boolean => {
    if (!id) return false;
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  /**
   * Fetch track information
   */
  useEffect(() => {
    if (!musicId) {
      setError("No track ID provided");
      setIsLoading(false);
      return;
    }

    if (!isValidMusicId(musicId)) {
      setError("Invalid track ID format");
      setIsLoading(false);
      return;
    }

    const fetchTrackInfo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/music/info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ musicId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch track info");
        }

        const data = await response.json();
        setTrackInfo(data);
        toast({
          title: "Track found!",
          description: "Ready to download as MP3.",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to fetch track information. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch track info.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackInfo();
  }, [musicId, toast]);

  /**
   * Handle MP3 download
   */
  const handleDownload = async () => {
    if (!musicId) return;

    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      // Create download link
      const downloadUrl = `${API_URL}/api/music/download?musicId=${musicId}`;
      
      // Create temporary anchor and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = trackInfo?.title ? `${trackInfo.title}.mp3` : "track.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadComplete(true);
      toast({
        title: "Download Started",
        description: "Your MP3 download has started.",
      });
    } catch (err) {
      console.error("Download error:", err);
      toast({
        title: "Download Failed",
        description: "Unable to start download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-accent/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <Header />

      <main className="relative pt-28 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/music")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Music
          </Button>

          {/* Loading State */}
          {isLoading && (
            <div className="glass-strong rounded-2xl p-12 text-center space-y-4 animate-fade-in">
              <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
              <h2 className="font-display text-xl font-semibold">Fetching Track Info...</h2>
              <p className="text-muted-foreground">Please wait while we get the track details.</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="glass-strong rounded-2xl p-8 text-center space-y-4 animate-fade-in">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h2 className="font-display text-2xl font-bold text-destructive">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="hero" onClick={() => navigate("/music")}>
                Try Again
              </Button>
            </div>
          )}

          {/* Track Info Display */}
          {trackInfo && !isLoading && !error && (
            <div className="glass-strong rounded-2xl overflow-hidden animate-fade-in">
              {/* Track Thumbnail */}
              <div className="relative aspect-video bg-background/50">
                <img
                  src={trackInfo.thumbnail}
                  alt={trackInfo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full glass text-xs text-muted-foreground">
                    <Music2 className="w-3 h-3" />
                    {trackInfo.duration}
                  </span>
                </div>
              </div>

              {/* Track Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h1 className="font-display text-2xl font-bold line-clamp-2">
                    {trackInfo.title}
                  </h1>
                  <p className="text-muted-foreground mt-1">{trackInfo.artist}</p>
                  {trackInfo.album && (
                    <p className="text-muted-foreground/70 text-sm mt-1">{trackInfo.album}</p>
                  )}
                </div>

                {/* Download Button */}
                <div className="pt-4 border-t border-border/30">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Preparing Download...
                      </>
                    ) : downloadComplete ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Download Started!
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download MP3
                      </>
                    )}
                  </Button>
                </div>

                {/* Info Note */}
                <p className="text-muted-foreground/70 text-xs text-center">
                  High-quality 320kbps MP3 with embedded metadata
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MusicDownload;
