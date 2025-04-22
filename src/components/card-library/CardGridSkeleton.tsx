
import { Skeleton } from "@/components/ui/skeleton";

const CARD_SKELETON_COUNT = 12; // adjust as needed for first-load

const CardGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: CARD_SKELETON_COUNT }).map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-lg border bg-card shadow-sm flex flex-col group"
        >
          {/* Image placeholder */}
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          <div className="p-3 space-y-2">
            {/* Name placeholder */}
            <Skeleton className="h-4 w-2/3 rounded"/>
            {/* Row for type & cost */}
            <div className="flex justify-between mt-2">
              <Skeleton className="h-3 w-1/3 rounded"/>
              <Skeleton className="h-3 w-1/4 rounded"/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridSkeleton;
