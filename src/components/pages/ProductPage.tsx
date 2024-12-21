import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
} from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import AxiosBase from "@/lib/axios";
import { Product } from "@/lib/type";
import { PageTableSkeleton } from "../loaders/PageTableSkeleton";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const naviage = useNavigate();
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await AxiosBase.get("/api/admin/products");
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });

  const getStockStatus = (status: string) => {
    const statusStyles = {
      active: "active",
      inactive: "secondary",
      out_of_stock: "destructive",
      discontinued: "outline",
    };
    return statusStyles[status as keyof typeof statusStyles] || "";
  };

  const handleClick = (id: string) => {
    naviage("/edit/" + id);
  };
  return (
    <div className="space-y-8 w-full">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground mt-2">
            Manage your product inventory and listings
          </p>
        </div>
        <Button onClick={() => naviage("/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </section>

      <section className="rounded-md border p-4">
        {/* Loading State */}
        {isLoading &&
          Array.from({ length: 3 }, (_, index: number) => index).map(
            (_, i: number) => <PageTableSkeleton key={i} />
          )}

        {/* Error State */}
        {isError && (
          <p className="text-center text-red-500">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching products."}
          </p>
        )}

        {/* No Products Found */}
        {!isLoading && !isError && products?.length === 0 && (
          <div className="text-center">
            <p className="text-muted-foreground">
              You don't have any products yet.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        )}

        {/* Product Table */}
        {!isLoading && !isError && products?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount%</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Live</TableHead>
                <TableHead>Featured</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product, index: number) => (
                <TableRow
                  onClick={() => handleClick(product.slug!)}
                  key={product.id}
                  className="cursor-pointer"
                >
                  <TableCell className="text-xs">{index + 1}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>&#8377;{product.price}</TableCell>
                  <TableCell>
                    {product.discountPercent && (
                      <div>
                        &#8377;
                        {((product.discountPercent as any) / 100) *
                          product.price}
                        <span className="text-xs  text-muted-foreground">
                          or {product?.discountPercent}%
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.totalQuantity}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStockStatus(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.isPublished ? (
                      <MdOutlinePublishedWithChanges size={20} color="blue" />
                    ) : (
                      <MdOutlineUnpublished size={20} color="gray" />
                    )}
                  </TableCell>
                  <TableCell>
                    {product.isFeatured === true && (
                      <Star color="#245fd4ce" className="w-5 h-5" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
};

export default ProductPage;
