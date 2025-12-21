import { Clock, Eye, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import DownloadProgress, { DownloadStatus } from "@/components/DownloadProgress";

// Interface for video metadata returned from the backend
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

interface DownloadState {
  id: string;
  status: DownloadStatus;
  progress: number;
  quality: string;
  downloadUrl?: string;
  error?: string;
}

interface VideoCardProps {
  video: VideoInfo;
  onDownload: (quality: string) => string;
  downloads: Map<string, DownloadState>;
  onDownloadFile: (downloadId: string) => void;
  onRetry: (downloadId: string) => void;
  getActiveDownload: (quality: string) => DownloadState | null;
}

/**
 * VideoCard Component
 * Displays fetched video information with download options and progress
 */
const VideoCard = ({ 
  video, 
  onDownload, 
  downloads,
  onDownloadFile,
  onRetry,
  getActiveDownload,
}: VideoCardProps) => {
  // Get array of active downloads for this video
  const activeDownloads = Array.from(downloads.values()).filter(
    d => d.status !== 'error' || d.status === 'error'
  );

  return (
    <div className="glass-strong rounded-2xl overflow-hidden animate-scale-in shadow-glow">
      {/* Thumbnail Section with Play Overlay */}
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-glow">
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-medium">
          {video.duration}
        </div>
      </div>

      {/* Video Info Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-foreground line-clamp-2 leading-tight">
          {video.title}
        </h3>

        {/* Channel & Stats */}
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span className="font-medium text-foreground/80">{video.channel}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{video.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{video.duration}</span>
          </div>
        </div>

        {/* Active Downloads */}
        {activeDownloads.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Downloads
            </h4>
            {activeDownloads.map(download => (
              <DownloadProgress
                key={download.id}
                status={download.status}
                progress={download.progress}
                quality={download.quality}
                downloadUrl={download.downloadUrl}
                error={download.error}
                onDownloadClick={() => onDownloadFile(download.id)}
                onRetry={() => onRetry(download.id)}
              />
            ))}
          </div>
        )}

        {/* Download Options */}
        <div className="pt-4 border-t border-border/50">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Download Options
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {video.formats.map((format, index) => {
              const activeDownload = getActiveDownload(format.quality);
              const isDownloading = activeDownload && 
                (activeDownload.status === 'downloading' || activeDownload.status === 'converting');
              
              return (
                <Button
                  key={index}
                  variant="glass"
                  className="justify-between group"
                  onClick={() => onDownload(format.quality)}
                  disabled={!!isDownloading}
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 group-hover:text-primary transition-colors" />
                    <span>{format.quality}</span>
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {isDownloading ? 'In progress...' : format.size}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
