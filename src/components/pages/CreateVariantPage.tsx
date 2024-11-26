import { lazy, Suspense } from "react";
import { ProductHeader } from "../products/ProductHeader";
import {
  ProductCreationSkeleton,
  ProductVariantSkeleton,
} from "../loaders/PageTableSkeleton";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosBase from "@/lib/axios";
import { Variant } from "@/lib/type";

const CreateVariantPage = () => {
  const { id: productId } = useParams();
  const ProductVariant = lazy(() => import("../products/ProductVariant"));
  const { data: product, isLoading } = useQuery({
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
  return (
    <div className="p-1  space-y-2 lg:p-6">
      <ProductHeader
        mode="create"
        variantLength={product.variants.map((v: Variant) => v.images).length}
        isPublished={product.isPublished}
        totalQuantity={product.totalQuantity}
      />
      <p className="text-muted-foreground text-xs lg:text-sm">
        You can change status later
      </p>
      <p className="text-muted-foreground text-xs  lg:text-sm">
        Create Product Variants and it&apos;s attributes and then publish the
        product.
      </p>

      <Suspense fallback={<ProductVariantSkeleton />}>
        <ProductVariant mode="create" />
      </Suspense>
    </div>
  );
};

export default CreateVariantPage;
