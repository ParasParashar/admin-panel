import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import AxiosBase from "@/lib/axios";
import { Loader } from "lucide-react";
import { useCategories } from "@/hooks/useCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import ProductDescriptionEditor from "./ProductDescriptionEditor";

interface ProductFormProps {
  mode: "create" | "edit";
  defaultData?: Partial<ProductDetails>;
}

interface ProductDetails {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  id?: string;
  isPublished?: boolean;
  status?: string;
  isFeatured?: boolean;
  discountPercent?: number;
}

const ProductForm = ({ mode, defaultData }: ProductFormProps) => {
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    status: mode === "edit" ? defaultData?.status ?? "" : "",
    discountPercent: defaultData?.discountPercent ?? 0,
    isFeatured: false,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const {
    data: categories = [],
    isLoading,
    isError: categoryError,
  } = useCategories();

  // Calculate discounted price
  const discountedPrice = productDetails.discountPercent
    ? productDetails.price -
      (productDetails.price * productDetails.discountPercent) / 100
    : null;

  useEffect(() => {
    if (defaultData) {
      setProductDetails((prev) => ({ ...prev, ...defaultData }));
    }
  }, [defaultData]);

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!productDetails.name.trim()) errors.name = "Product name is required.";
    if (!productDetails.description.trim())
      errors.name = "Product description is required.";
    if (productDetails.price <= 0)
      errors.price = "Price must be greater than zero.";
    if (!productDetails.categoryId)
      errors.categoryId = "Please select a category.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const endpoint =
        mode === "create"
          ? "/api/admin/product/create"
          : `/api/admin/product/update/${defaultData?.id}`;
      // const formData = { ...productDetails };
      const { data } = await AxiosBase.post(endpoint, productDetails);
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        mode === "create"
          ? "Product created successfully!"
          : "Product updated successfully!"
      );
      if (mode === "create") {
        setProductDetails({
          name: "",
          description: "",
          price: 0,
          categoryId: "",
          status: "",
          discountPercent: 0,
        });
        navigate(`/create/${data.data.slug}`);
      } else {
        navigate(`/edit/${data.data.slug}`);
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error(
        mode === "create"
          ? "Failed to create product. Please try again."
          : "Failed to update product. Please try again."
      );
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProductDetails((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discountPercent" ? +value : value,
    }));

    // Clear errors as user updates fields
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      mutate();
    }
  };

  return (
    <section className="min-w-3xl mx-auto p-3 lg:px-5 bg-white shadow-md rounded-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {mode === "create" ? "Create Product Details" : "Edit Product Details"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Name
          </label>
          <Input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={formErrors.name ? "border-red-500" : ""}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <ProductDescriptionEditor
            prevDescriptor={productDetails.description}
            onSelect={(d) =>
              setProductDetails((prev) => ({ ...prev, description: d }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price
          </label>
          <Input
            type="number"
            name="price"
            value={productDetails.price}
            onChange={handleChange}
            placeholder="Enter product price"
          />
          {formErrors.price && (
            <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Discount (%)
          </label>
          <Input
            type="number"
            name="discountPercent"
            value={productDetails.discountPercent || ""}
            onChange={handleChange}
            placeholder="Enter discount percent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Feature this Product
          </label>
          <div className="flex items-center justify-start w-full space-x-2">
            <Input
              type="checkbox"
              name="isFeatured"
              className="w-6 rounded-full"
              checked={productDetails.isFeatured || false}
              onChange={(e) =>
                setProductDetails((prev) => ({
                  ...prev,
                  isFeatured: e.target.checked,
                }))
              }
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mark this product as featured.
            </span>
          </div>
        </div>

        {discountedPrice !== null && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Discounted Price
            </label>
            <p className="text-lg font-semibold">
              {discountedPrice.toFixed(2)}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          {isLoading ? (
            <Loader className="animate-spin mx-auto text-sm" />
          ) : categoryError ? (
            <p className="text-red-500">Failed to load categories.</p>
          ) : (
            <Select
              name="categoryId"
              value={productDetails.categoryId}
              onValueChange={(value) =>
                setProductDetails((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {formErrors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
          )}
        </div>

        {mode === "edit" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              name="status"
              value={productDetails.status}
              onValueChange={(value) =>
                setProductDetails((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button disabled={isPending} size="lg" type="submit">
          {isPending ? (
            <Loader className="animate-spin mx-auto text-sm" />
          ) : mode === "create" ? (
            "Create Product"
          ) : (
            "Update Product"
          )}
        </Button>
      </form>
    </section>
  );
};

export default ProductForm;
