import { Skeleton } from "../ui/skeleton";
export function OrderSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full">
          <div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-5 w-[80px]" />
            </div>
          </div>
          <div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-[100px] mb-2" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-[200px] mb-2" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const OrderDetailsSkeleton = () => {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r rounded-lg from-[#3e2723] to-[#8a574e]">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-5 w-1/4" />
      </div>

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-5 w-3/4" />
            <div className="mt-5 flex items-center space-x-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
