import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, NutOffIcon, Trash } from "lucide-react";
import ConfirmModel from "../shared/ConfirmModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosBase from "@/lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

type props = {
  isPublished?: boolean;
  totalQuantity?: number;
  mode: "create" | "edit";
  variantLength: number;
};

export function ProductHeader({
  totalQuantity = 0,
  isPublished,
  mode,
  variantLength,
}: props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: productId } = useParams();
  const {
    mutate: publishProduct,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const { data } = await AxiosBase.put(
        `/api/admin/product/update/publish/${productId}`
      );
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Procuct is now " + isPublished
          ? "published"
          : "unpublished"
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/product");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: () => {
      toast.error(error?.message || "Failed to do action.");
    },
  });
  const { mutate: deleteProduct, isPending: deletePending } = useMutation({
    mutationFn: async () => {
      const { data } = await AxiosBase.delete(
        `/api/admin/product/update/delete/${productId}`
      );
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Procuct is deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["trash"] });

      navigate("/product");
    },
    onError: () => {
      toast.error(error?.message || "Failed to do action.");
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    publishProduct();
  };
  const handleDelete = () => {
    if (isPublished) {
      return toast.error("First Unpublish Product to delete ");
    }
    deleteProduct();
  };

  const isPublishProduct = variantLength > 0;
  return (
    <header className="flex items-center justify-between  ">
      {/* Left Section: Total Quantity */}
      <div className="flex flex-col justify-start gap-1 items-start ">
        <p className="text-md text-muted-foreground font-semibold">
          Total Stock Quantity: <span>{totalQuantity}</span>
        </p>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        {/* Toggle Publish */}
        <Button
          onClick={handleToggle}
          variant="outline"
          disabled={isPending || !isPublishProduct}
          size="sm"
          className=" border-2 border-muted-foreground hover:scale-110 transition-all ease-in duration-300"
        >
          {isPending && <Loader2 className="animate-spin" />}
          <span>
            {isPublished ? "Unpublish Product❌" : "Publish Product🛒"}
          </span>
        </Button>

        {/* Delete Button */}
        <ConfirmModel
          message="You can also recover product from the trash. If you deleted mistakely."
          onConfirm={handleDelete}
        >
          <Button
            className="ml-auto  hover:scale-110 transition-all ease-in duration-300"
            size={"sm"}
            disabled={deletePending}
            variant="destructive"
          >
            {deletePending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </ConfirmModel>
      </div>
    </header>
  );
}
