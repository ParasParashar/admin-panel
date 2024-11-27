import AxiosBase from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Loader, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { GiAnticlockwiseRotation } from "react-icons/gi";
import { TbTrash } from "react-icons/tb";
import ConfirmModel from "./ConfirmModel";
import { Skeleton } from "../ui/skeleton";
import toast from "react-hot-toast";

type Product = {
  name: string;
  id: string;
};

const TrashDropDown = () => {
  const queryClient = useQueryClient();

  // Fetch trash products
  const {
    data: products = [], // Default to an empty array
    isLoading,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["trash"],
    queryFn: async () => {
      const { data } = await AxiosBase.get("/api/admin/products/trash");
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });

  // Mutation for deleting a product
  const { mutate: deleteProduct, isPending: deletePending } = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await AxiosBase.delete(
        `/api/admin/products/trash/${id}`
      );
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Product deleted permanently!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete product permanently.");
    },
  });

  // Mutation for recycling a product
  const { mutate: recycleProduct, isPending: recyclePending } = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await AxiosBase.delete(
        `/api/admin/product/update/delete/${productId}`
      );
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data: any) => {
      if (data.message) {
        toast.success("Product recycled successfully!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["trash"] });
      }
      refetch();
    },
    onError: () => {
      toast.error("Failed to recycle product.");
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-0 active:border-0 ring-0 hover:shadow-inner text-md p-2 flex items-center justify-between w-full text-muted-foreground">
        <Trash size={15} /> Products
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[200px]" side="right">
        <DropdownMenuLabel className="text-xs font-light text-muted-foreground">
          Deleted Products
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Loading state */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex mt-1 w-full justify-between gap-1">
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-1 items-center">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          ))}

        {/* No products found */}
        {!isLoading && products.length === 0 && (
          <span className="text-center text-xs text-muted-foreground">
            No Trash Products found
          </span>
        )}

        {/* List of products */}
        {!isLoading &&
          products.map((product) => (
            <DropdownMenuItem key={product.id}>
              <div className="w-full flex items-center justify-between">
                <span>{product.name}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => recycleProduct(product.id)}
                    disabled={recyclePending}
                    size={"icon"}
                    className="rounded-full text-blue-400"
                    variant={"outline"}
                  >
                    {recyclePending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <GiAnticlockwiseRotation size={10} />
                    )}
                  </Button>
                  <ConfirmModel onConfirm={() => deleteProduct(product.id)}>
                    <Button
                      size={"icon"}
                      className="rounded-full text-red-400"
                      variant={"outline"}
                    >
                      {deletePending ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <TbTrash size={10} />
                      )}
                    </Button>
                  </ConfirmModel>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TrashDropDown;
