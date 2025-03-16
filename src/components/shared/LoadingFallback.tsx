
import { Loader2 } from "lucide-react";

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
