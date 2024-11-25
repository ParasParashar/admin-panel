import { Skeleton } from "../ui/skeleton";

export function PageTableSkeleton() {
  return (
    <div className="w-full p-1 rounded-full">
      <Skeleton className="rounded-lg w-full  h-10 " />
    </div>
  );
}
