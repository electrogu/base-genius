export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
      
      {/* Progress Bar Skeleton */}
      <div className="w-full h-2 bg-gray-200 rounded-full"></div>

      {/* Card Skeleton */}
      <div className="bg-white rounded-2xl p-8 space-y-6 border border-gray-100 h-[400px]">
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
        </div>

        <div className="space-y-4 pt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}