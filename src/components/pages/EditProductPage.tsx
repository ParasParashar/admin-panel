import AxiosBase from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import {
  ProductCreationSkeleton,
  ProductVariantSkeleton,
} from "../loaders/PageTableSkeleton";
import { ProductHeader } from "../products/ProductHeader";
import { Variant } from "@/lib/type";
import { MdError } from "react-icons/md";

const EditProductPage = () => {
  const { id: productId } = useParams();
  const ProductForm = lazy(() => import("../products/ProductForm"));
  const ProductVariant = lazy(() => import("../products/ProductVariant"));
  const {
    data: product,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await AxiosBase.get(`/api/admin/product/${productId}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
  if (isLoading) {
    return (
      <div className="p-1 lg:p-6 gap-3 flex flex-col">
        <ProductCreationSkeleton />
        <ProductVariantSkeleton />
      </div>
    );
  }
  if (!product && !isLoading) {
    return (
      <div className="p-5 w-full mt-20  text-muted-foreground flex items-center gap-3 flex-col justify-center">
        <p className="text-xl text-muted-foreground">Product Not found</p>
        <MdError size={20} />
      </div>
    );
  }
  return (
    <div className="p-1  space-y-2 lg:p-6">
      <ProductHeader
        mode="edit"
        isPublished={product.isPublished}
        variantLength={product.variants.map((v: Variant) => v.images).length}
        totalQuantity={product.totalQuantity}
      />
      <Suspense fallback={<ProductCreationSkeleton />}>
        <ProductForm mode="edit" defaultData={product} />
      </Suspense>
      <Suspense fallback={<ProductVariantSkeleton />}>
        <ProductVariant mode="edit" defaultVariants={product.variants} />
      </Suspense>
      {isError && (
        <span className="text-xs text-red-500">Error: {error?.message}</span>
      )}
    </div>
  );
};

export default EditProductPage;
