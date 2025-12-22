import { Download, CheckCircle, Loader2, AlertCircle, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type DownloadStatus = 'idle' | 'downloading' | 'converting' | 'ready' | 'error';

interface DownloadProgressProps {
  status: DownloadStatus;
  progress: number;
  quality: string;
  downloadUrl?: string;
  error?: string;
  onDownloadClick?: () => void;
  onRetry?: () => void;
}

const statusConfig = {
  idle: {
    icon: Download,
    text: 'Ready to download',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
  },
  downloading: {
    icon: Loader2,
    text: 'Downloading...',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  converting: {
    icon: Loader2,
    text: 'Converting...',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  ready: {
    icon: CheckCircle,
    text: 'Ready to download',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  error: {
    icon: AlertCircle,
    text: 'Download failed',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};

/**
 * DownloadProgress Component
 * Shows download progress bar and status with download button
 */
const DownloadProgress = ({
  status,
  progress,
  quality,
  downloadUrl,
  error,
  onDownloadClick,
  onRetry,
}: DownloadProgressProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isAnimating = status === 'downloading' || status === 'converting';

  return (
    <div className="glass rounded-2xl p-5 space-y-4 animate-fade-in border border-border/30">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center ${config.color} transition-all duration-300`}>
            <Icon className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="font-semibold text-foreground">{quality} Quality</p>
            <p className={`text-sm ${config.color} font-medium`}>{error || config.text}</p>
          </div>
        </div>
        
        {/* Progress percentage */}
        {(status === 'downloading' || status === 'converting') && (
          <span className="text-3xl font-display font-bold text-primary tabular-nums">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {(status === 'downloading' || status === 'converting') && (
        <div className="space-y-2">
          <div className="relative">
            <Progress value={progress} className="h-2.5" />
            <div 
              className="absolute top-0 left-0 h-2.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center font-medium">
            {status === 'downloading' ? 'Downloading video...' : 'Converting to MP4...'}
          </p>
        </div>
      )}

      {/* Download button when ready */}
      {status === 'ready' && downloadUrl && (
        <Button
          variant="hero"
          size="lg"
          className="w-full gap-2.5"
          onClick={onDownloadClick}
        >
          <FileVideo className="w-5 h-5" />
          Download MP4
        </Button>
      )}

      {/* Retry button on error */}
      {status === 'error' && onRetry && (
        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2.5"
          onClick={onRetry}
        >
          <Download className="w-5 h-5" />
          Retry Download
        </Button>
      )}
    </div>
  );
};

export default DownloadProgress;