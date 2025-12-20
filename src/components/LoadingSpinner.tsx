/**
 * LoadingSpinner Component
 * Animated loading indicator with pulsing circles
 * Uses the primary color from the design system
 */
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {/* Animated spinner rings */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        {/* Inner pulsing dot */}
        <div className="absolute inset-4 rounded-full bg-primary/20 animate-pulse" />
      </div>
      
      {/* Loading text */}
      <p className="text-muted-foreground text-sm font-medium animate-pulse">
        Fetching video info...
      </p>
    </div>
  );
};

export default LoadingSpinner;
