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
import { Textarea } from "../ui/textarea";

interface ProductFormProps {
  mode: "create" | "edit";
  defaultData?: Partial<ProductDetails>;
  onSuccess?: (id: string) => void;
}

interface ProductDetails {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  id?: string;
  ispubLished?: boolean;
  status?: string;
}

const ProductForm = ({ mode, defaultData, onSuccess }: ProductFormProps) => {
  const [productDetails, setProductDetails] = useState<ProductDetails>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    status: "",
  });
  const queryClient = useQueryClient();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const {
    data: categories = [],
    isLoading,
    isError: categoryError,
  } = useCategories();

  useEffect(() => {
    if (defaultData) setProductDetails((prev) => ({ ...prev, ...defaultData }));
  }, [defaultData]);

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!productDetails.name.trim()) errors.name = "Product name is required.";
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
      const { data } = await AxiosBase.post(endpoint, productDetails);
      if (!data.success) throw new Error(data.message);
      if (mode === "create") onSuccess(data.data.id);
      return data;
    },
    onSuccess: () => {
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
        });
        setFormErrors({});
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
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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
        {mode === "create" ? "Create Product" : "Edit Product"}
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
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <Textarea
            name="description"
            value={productDetails.description}
            onChange={handleChange}
            placeholder="Enter product description"
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

        <div className="grid gap-1 grid-cols-2 items-center justify-center">
          <div>
            <label
              htmlFor="categoryId"
              className=" text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
                  setProductDetails({ ...productDetails, categoryId: value })
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
              <p className="text-red-500 text-sm mt-1">
                {formErrors.categoryId}
              </p>
            )}
          </div>
          {mode === "edit" && (
            <>
              <div>
                <label
                  htmlFor="status"
                  className=" text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <Select
                  name="status"
                  value={productDetails.status}
                  onValueChange={(value) =>
                    setProductDetails({ ...productDetails, status: value })
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
            </>
          )}
        </div>

        <Button disabled={isPending} size="lg" type="submit">
          {isPending ? (
            <Loader className="animate-spin" />
          ) : mode === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </section>
  );
};

export default ProductForm;
