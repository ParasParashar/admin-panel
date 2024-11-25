import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import AxiosBase from "@/lib/axios";
import { Loader } from "lucide-react";
import { useCategories } from "@/hooks/useCategory";

interface ProductCreationProps {
  onProductCreated: (id: string) => void; // Callback prop for passing productId
}

const ProductCreation = ({ onProductCreated }: ProductCreationProps) => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const {
    data: categories = [],
    isLoading,
    isError: categoryError,
  } = useCategories();

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

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => {
      const { data } = await AxiosBase.post(
        "/api/admin/product/create",
        productDetails
      );
      onProductCreated(data.data.id);
      return data;
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      setProductDetails({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
      });
      setFormErrors({});
    },
    onError: () => {
      toast.error("Failed to create product. Please try again.");
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
    <section className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Create Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={productDetails.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
              formErrors.name ? "border-red-500 focus:ring-red-500" : ""
            }`}
            placeholder="Enter product name"
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        {/* Product Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productDetails.description}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter product description"
            rows={4}
          ></textarea>
        </div>

        {/* Product Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={productDetails.price}
            onChange={handleChange}
            className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
              formErrors.price ? "border-red-500 focus:ring-red-500" : ""
            }`}
            placeholder="Enter product price"
            min={0}
            step={0.01}
          />
          {formErrors.price && (
            <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category
          </label>
          {isLoading ? (
            <Loader size={15} className="animate-spin mx-auto text-sm" />
          ) : categoryError ? (
            <p className="text-red-500 dark:text-red-400">
              Failed to load categories.
            </p>
          ) : (
            <select
              id="categoryId"
              name="categoryId"
              value={productDetails.categoryId}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${
                formErrors.categoryId ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {formErrors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button disabled={isPending} size={"lg"} type="submit">
          {isPending ? <Loader className="animate-spin" /> : "Create Product"}
        </Button>
        {isError && (
          <p className="text-red-500 text-sm mt-3">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  );
};

export default ProductCreation;
