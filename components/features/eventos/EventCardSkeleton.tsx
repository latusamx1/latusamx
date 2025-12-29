/**
 * Skeleton loader para EventCard
 */

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="relative h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
        <div className="space-y-1 mb-3">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

export function EventCardFeaturedSkeleton() {
  return (
    <div className="md:col-span-2 lg:col-span-3 bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 h-64 md:h-auto bg-gray-200"></div>
        <div className="md:w-1/2 p-6">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
