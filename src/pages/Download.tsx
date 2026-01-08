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

/**
 * Download Page - Handles video fetching and downloading via query params
 */
const Download = () => {
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

  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";

  /**
   * Fetch video information from the backend
   */
  useEffect(() => {
    if (!videoId) {
      setError("No video ID provided");
      return;
    }

    const fetchVideo = async () => {
      setIsLoading(true);
      setVideoInfo(null);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/fetch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: videoUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch video info");
        }

        const data = await response.json();
        setVideoInfo(data);
        toast({
          title: "Video found!",
          description: "Select a quality to download.",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to connect to the backend. Please try again later.");
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
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          {/* Error State */}
          {error && !isLoading && (
            <div className="glass-strong rounded-2xl p-8 text-center space-y-4">
              <h2 className="font-display text-2xl font-bold text-destructive">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="hero" onClick={() => navigate("/")}>
                Go Back
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <section className="mb-14">
              <LoadingSpinner />
            </section>
          )}

          {/* Video Info Display */}
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

export default Download;
