import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner Component
 * Animated loading spinner with modern styling
 */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fade-in">
      {/* Spinner container with glow */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse-slow" />
        
        {/* Outer ring */}
        <div className="relative w-20 h-20 rounded-full border-4 border-secondary flex items-center justify-center">
          {/* Inner spinning gradient */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
          
          {/* Center icon */}
          <Loader2 className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-display font-semibold text-foreground">
          Fetching Video Info
        </p>
        <p className="text-sm text-muted-foreground">
          Please wait while we process your request...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;