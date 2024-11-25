import AxiosBase from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../products/ProductForm";

const EditProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div className="p-3 lg:p-6">
      <h1 className="text-xl font-semibold mb-4">Update Product</h1>
      <ProductForm mode="edit" defaultData={product} />
    </div>
  );
};

export default EditProductPage;
