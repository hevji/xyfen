import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDownload } from "@/hooks/useDownload";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/config";

// Video metadata interface (same as main Download page)
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

/**
 * Music Download Page - Handles music fetching and downloading via query params
 * Uses the SAME flow as the main Download page
 */
const MusicDownload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get("videoId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    downloads,
    startDownload,
    downloadFile,
    retryDownload,
    getActiveDownload,
  } = useDownload({ apiUrl: API_URL });

  // Normalize YouTube Music URL to standard YouTube URL
  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";

  /**
   * Fetch video information from the backend
   * Uses the SAME /api/fetch endpoint as main site
   */
  useEffect(() => {
    if (!videoId) {
      setError("No video ID provided");
      return;
    }

    // Validate video ID format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      setError("Invalid video ID format");
      return;
    }

    const fetchVideo = async () => {
      setIsLoading(true);
      setVideoInfo(null);
      setError(null);

      // Debug logging
      console.log("[MusicDownload] Video ID:", videoId);
      console.log("[MusicDownload] Normalized URL:", videoUrl);
      console.log("[MusicDownload] API URL:", API_URL);

      try {
        const fetchEndpoint = `${API_URL}/api/fetch`;
        console.log("[MusicDownload] Fetching from:", fetchEndpoint);
        
        const response = await fetch(fetchEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: videoUrl }),
        });

        console.log("[MusicDownload] Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("[MusicDownload] Error response:", errorData);
          throw new Error(errorData.error || "Failed to fetch track info");
        }

        const data = await response.json();
        console.log("[MusicDownload] Track data received:", data.title);
        
        setVideoInfo(data);
        toast({
          title: "Track found!",
          description: "Select a quality to download.",
        });
      } catch (err) {
        console.error("[MusicDownload] Fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(`Unable to fetch track info: ${errorMessage}`);
        toast({
          title: "Connection Error",
          description: "Unable to connect to the backend. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, videoUrl, toast]);

  /**
   * Handle video download request
   */
  const handleDownload = (quality: string, includeTitle: boolean): string => {
    toast({
      title: "Download Started",
      description: `Starting ${quality} download...`,
    });

    const downloadId = `${Date.now()}-${quality}`;
    startDownload(videoUrl, quality, includeTitle);
    return downloadId;
  };

  /**
   * Handle retry for failed downloads
   */
  const handleRetry = (downloadId: string) => {
    retryDownload(downloadId, videoUrl);
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
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/music")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Music
          </Button>

          {/* Error State */}
          {error && !isLoading && (
            <div className="glass-strong rounded-2xl p-8 text-center space-y-4">
              <h2 className="font-display text-2xl font-bold text-destructive">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="hero" onClick={() => navigate("/music")}>
                  Try Again
                </Button>
                <Button variant="glass" onClick={() => window.location.reload()}>
                  Reload
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <section className="mb-14">
              <LoadingSpinner />
            </section>
          )}

          {/* Video Info Display - Uses same VideoCard as main site */}
          {videoInfo && !isLoading && (
            <section className="mb-14 animate-fade-in">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MusicDownload;
