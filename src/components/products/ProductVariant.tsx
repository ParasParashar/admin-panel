import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AxiosBase from "@/lib/axios";
import ImageUpload from "./ImageUpload";

type prop = {
  productId?: string;
};

const ProductVariant = ({ productId }: prop) => {
  console.log("this is the product id", productId);

  const [variants, setVariants] = useState([
    {
      color: "",
      images: [] as File[],
      attributes: [{ size: "", stock: 0, price: 0 }],
    },
  ]);

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    variantIndex: number,
    attrIndex?: number
  ) => {
    const { name, value, type, files } = e.target;
    const parsedValue = type === "number" ? +value : value;

    setVariants((prev) => {
      const updatedVariants = [...prev];
      if (attrIndex !== undefined) {
        // Update specific attribute
        updatedVariants[variantIndex].attributes[attrIndex][name] = parsedValue;
      } else if (type === "file") {
        updatedVariants[variantIndex][name] = Array.from(files || []);
      } else {
        updatedVariants[variantIndex][name] = parsedValue;
      }
      return updatedVariants;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        images: [] as File[],
        attributes: [{ size: "", stock: 0, price: 0 }],
      },
    ]);
  };

  const deleteVariant = (variantIndex: number) => {
    setVariants((prev) => prev.filter((_, index) => index !== variantIndex));
  };

  const addAttribute = (variantIndex: number) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[variantIndex].attributes.push({
        size: "",
        stock: 0,
        price: 0,
      });
      return updatedVariants;
    });
  };

  const deleteAttribute = (variantIndex: number, attrIndex: number) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[variantIndex].attributes.splice(attrIndex, 1);
      return updatedVariants;
    });
  };

  const validateVariants = () => {
    const newErrors: string[] = [];
    variants.forEach((variant, vIndex) => {
      if (!variant.color.trim()) {
        newErrors.push(`Variant ${vIndex + 1}: Color is required.`);
      }
      variant.attributes.forEach((attr, aIndex) => {
        if (!attr.size.trim()) {
          newErrors.push(
            `Variant ${vIndex + 1}, Attribute ${aIndex + 1}: Size is required.`
          );
        }
        if (attr.stock < 0) {
          newErrors.push(
            `Variant ${vIndex + 1}, Attribute ${
              aIndex + 1
            }: Stock must be >= 0.`
          );
        }
        if (attr.price < 0) {
          newErrors.push(
            `Variant ${vIndex + 1}, Attribute ${
              aIndex + 1
            }: Price must be >= 0.`
          );
        }
      });
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await AxiosBase.post(
        "/api/admin/product/createvariant",
        { variantData: variants, productId: "67407ea1bada666262618aae" }
      );

      //   onProductCreated(data.data.id);
      return data;
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
    },
    onError: () => {
      console.log("Error creating product variant!");
      toast.error("Failed to create product.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVariants()) {
      return;
    }
    console.log("Submitted Variants:", variants);
    mutate();
    // Handle submission logic here (e.g., send to backend).
  };

  return (
    <section className="max-w-4xl mx-auto p-6 dark:bg-gray-800 rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
        Manage Product Variants
      </h2>

      {errors.length > 0 && (
        <div className="mb-4 p-4 text-red-600 bg-red-100 border border-red-400 rounded-md">
          <ul className="list-disc pl-6">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {variants.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className="p-6 border rounded-md bg-white dark:bg-gray-700 shadow-lg relative"
          >
            <Button
              size={"icon"}
              variant={"ghost"}
              type="button"
              onClick={() => deleteVariant(variantIndex)}
              className="absolute top-2 right-2 rounded-full text-red-500 hover:text-red-700"
            >
              ❌
            </Button>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Variant {variantIndex + 1}
            </h3>

            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Color:
            </label>
            <input
              name="color"
              type="text"
              value={variant.color}
              onChange={(e) => handleInputChange(e, variantIndex)}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
              placeholder="Enter color (e.g., Red)"
            />

            {/* <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Images:
            </label>
            <input
              name="images"
              type="file"
              multiple
              onChange={(e) => handleInputChange(e, variantIndex)}
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
            /> */}

            <ImageUpload
              onImagesChange={(files) => {
                setVariants((prev) => {
                  const updatedVariants = [...prev];
                  updatedVariants[variantIndex].images = files;
                  return updatedVariants;
                });
              }}
            />

            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Attributes
            </h4>
            {variant.attributes.map((attr, attrIndex) => (
              <div
                key={attrIndex}
                className="mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-600 relative"
              >
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  type="button"
                  onClick={() => deleteAttribute(variantIndex, attrIndex)}
                  className="absolute rounded-full top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ❌
                </Button>

                <label className="block mb-2 text-gray-600 dark:text-gray-300">
                  Size:
                </label>
                <input
                  name="size"
                  type="text"
                  value={attr.size}
                  onChange={(e) =>
                    handleInputChange(e, variantIndex, attrIndex)
                  }
                  className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  placeholder="Enter size (e.g., M, L)"
                />
                <label className="block mb-2 text-gray-600 dark:text-gray-300">
                  Stock:
                </label>
                <input
                  name="stock"
                  type="number"
                  value={attr.stock}
                  onChange={(e) =>
                    handleInputChange(e, variantIndex, attrIndex)
                  }
                  className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  placeholder="Enter stock"
                />
                <label className="block mb-2 text-gray-600 dark:text-gray-300">
                  Price:
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={attr.price}
                  onChange={(e) =>
                    handleInputChange(e, variantIndex, attrIndex)
                  }
                  className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                  placeholder="Enter price"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addAttribute(variantIndex)}
              className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              + Add Attribute
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 mt-4"
        >
          + Add Variant
        </button>

        <button
          type="submit"
          className="w-full px-4 py-2 mt-6 text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
          Save Variants
        </button>
      </form>
    </section>
  );
};

export default ProductVariant;
