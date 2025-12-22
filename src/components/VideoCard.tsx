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
    <div className="glass-strong rounded-3xl overflow-hidden animate-scale-in shadow-glow">
      {/* Thumbnail Section with Play Overlay */}
      <div className="relative group overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover transition-all duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow-lg transform scale-75 group-hover:scale-100 transition-all duration-500">
            <Play className="w-9 h-9 text-primary-foreground ml-1" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-semibold border border-border/50">
          {video.duration}
        </div>
      </div>

      {/* Video Info Section */}
      <div className="p-7 space-y-5">
        {/* Title */}
        <h3 className="font-display text-xl font-bold text-foreground line-clamp-2 leading-tight">
          {video.title}
        </h3>

        {/* Channel & Stats */}
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <span className="font-semibold text-foreground/90 px-3 py-1 rounded-lg bg-secondary/50">
            {video.channel}
          </span>
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{video.views}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{video.duration}</span>
          </div>
        </div>

        {/* Active Downloads */}
        {activeDownloads.length > 0 && (
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
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
        <div className="pt-5 border-t border-border/30 space-y-5">
          {/* Filename Option */}
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-secondary/30 border border-border/30">
            <Checkbox
              id="includeTitle"
              checked={includeTitle}
              onCheckedChange={(checked) => setIncludeTitle(checked === true)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="includeTitle"
              className="text-sm text-muted-foreground cursor-pointer font-medium"
            >
              Include video title in filename
            </Label>
          </div>

          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Download Options
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {video.formats.map((format, index) => {
              const activeDownload = getActiveDownload(format.quality);
              const isDownloading = activeDownload && 
                (activeDownload.status === 'downloading' || activeDownload.status === 'converting');
              
              return (
                <Button
                  key={index}
                  variant="glass"
                  className="justify-between group h-12"
                  onClick={() => onDownload(format.quality, includeTitle)}
                  disabled={!!isDownloading}
                >
                  <span className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
                    <span className="font-semibold">{format.quality}</span>
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">
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