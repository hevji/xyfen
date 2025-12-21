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
  },
  downloading: {
    icon: Loader2,
    text: 'Downloading...',
    color: 'text-primary',
  },
  converting: {
    icon: Loader2,
    text: 'Converting...',
    color: 'text-primary',
  },
  ready: {
    icon: CheckCircle,
    text: 'Ready to download',
    color: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    text: 'Download failed',
    color: 'text-destructive',
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
    <div className="glass rounded-xl p-4 space-y-4 animate-fade-in">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${config.color}`}>
            <Icon className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="font-medium text-foreground">{quality} Quality</p>
            <p className={`text-sm ${config.color}`}>{error || config.text}</p>
          </div>
        </div>
        
        {/* Progress percentage */}
        {(status === 'downloading' || status === 'converting') && (
          <span className="text-2xl font-display font-bold text-primary">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {(status === 'downloading' || status === 'converting') && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {status === 'downloading' ? 'Downloading video...' : 'Converting to MP4...'}
          </p>
        </div>
      )}

      {/* Download button when ready */}
      {status === 'ready' && downloadUrl && (
        <Button
          variant="hero"
          size="lg"
          className="w-full gap-2"
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
          className="w-full gap-2"
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
