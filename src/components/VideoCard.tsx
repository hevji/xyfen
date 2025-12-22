import { useState } from "react";
import { Clock, Eye, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  onDownload: (quality: string, includeTitle: boolean) => string;
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
  const [includeTitle, setIncludeTitle] = useState(true);

  // Get array of active downloads for this video
  const activeDownloads = Array.from(downloads.values()).filter(
    d => d.status !== 'error' || d.status === 'error'
  );

  // Check if error is premium-related
  const isPremiumError = (error?: string) => {
    if (!error) return false;
    const premiumKeywords = ['premium', 'members only', 'membership', 'paid', 'subscriber'];
    return premiumKeywords.some(keyword => error.toLowerCase().includes(keyword));
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden animate-scale-in shadow-glow">
      {/* Thumbnail Section with Play Overlay */}
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-glow transform scale-90 group-hover:scale-100 transition-transform duration-300">
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
                error={
                  isPremiumError(download.error)
                    ? "This video requires YouTube Premium and cannot be downloaded."
                    : download.error
                }
                onDownloadClick={() => onDownloadFile(download.id)}
                onRetry={isPremiumError(download.error) ? undefined : () => onRetry(download.id)}
              />
            ))}
          </div>
        )}

        {/* Download Options */}
        <div className="pt-4 border-t border-border/50 space-y-4">
          {/* Filename Option */}
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50">
            <Checkbox
              id="includeTitle"
              checked={includeTitle}
              onCheckedChange={(checked) => setIncludeTitle(checked === true)}
            />
            <Label
              htmlFor="includeTitle"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Include video title in filename
            </Label>
          </div>

          <h4 className="text-sm font-medium text-muted-foreground">
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
                  className="justify-between group hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => onDownload(format.quality, includeTitle)}
                  disabled={!!isDownloading}
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
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