import { Skeleton } from "../ui/skeleton";

export function PageTableSkeleton() {
  return (
    <div className="w-full p-1 rounded-full">
      <Skeleton className="rounded-lg w-full  h-10 " />
    </div>
  );
}

export function ProductVariantSkeleton() {
  return (
    <div className="space-y-6 h-full">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3 rounded-md bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col border border-gray-300 rounded-md p-4 space-y-4 bg-gray-100"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 rounded bg-gray-200" />
              <Skeleton className="h-4 w-1/3 rounded bg-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, attrIndex) => (
                <Skeleton
                  key={attrIndex}
                  className="h-20 w-20 rounded-md bg-gray-200"
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[...Array(3)].map((_, attrIndex) => (
                <Skeleton
                  key={attrIndex}
                  className="h-48 w-full rounded-md bg-gray-200"
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-10 w-1/2 rounded-lg bg-gray-200" />
          <Skeleton className="h-10 w-1/2 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ProductCreationSkeleton() {
  return (
    <div className="space-y-6 p-1">
      <Skeleton className="h-8 w-1/2 bg-gray-200 rounded-md" />

      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-1/4 bg-gray-200 rounded" />
            <Skeleton className="h-10 w-full bg-gray-200 rounded-md mt-2" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-32 w-full bg-gray-200 rounded-md" />
        <Skeleton className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-full bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}
