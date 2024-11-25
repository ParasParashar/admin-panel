import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AxiosBase from "@/lib/axios";
import ImageUpload from "./ImageUpload";
import { cn } from "@/lib/utils";
import { RxCross1, RxCross2 } from "react-icons/rx";

type prop = {
  productId?: string;
};

type Attribute = {
  size: string;
  stock: number;
  price: number;
};

type Variant = {
  color: string;
  images: string[];
  attributes: Attribute[];
};

const ProductVariant = ({ productId }: prop) => {
  const [variants, setVariants] = useState<Variant[]>([
    {
      color: "",
      images: [],
      attributes: [{ size: "", stock: 0, price: 0 }],
    },
  ]);

  const [errors, setErrors] = useState<string[]>([]);

  // Function to handle input changes
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      variantIndex: number,
      attrIndex?: number
    ) => {
      const { name, value, type } = e.target;
      const parsedValue = type === "number" ? +value : value;

      setVariants((prev) => {
        const updatedVariants = [...prev];
        if (attrIndex !== undefined) {
          updatedVariants[variantIndex].attributes[attrIndex][
            name as keyof Attribute
          ] = parsedValue as never;
        } else {
          updatedVariants[variantIndex][name as keyof Variant] =
            parsedValue as never;
        }
        return updatedVariants;
      });
    },

    []
  );
  const handleImageState = (urls: string[], variantIndex: number) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex ? { ...variant, images: urls } : variant
      )
    );
  };

  const addVariant = useCallback(() => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        images: [] as string[],
        attributes: [{ size: "", stock: 0, price: 0 }],
      },
    ]);
  }, []);

  const deleteVariant = useCallback((variantIndex: number) => {
    setVariants((prev) => prev.filter((_, index) => index !== variantIndex));
  }, []);

  const addAttribute = useCallback((variantIndex: number) => {
    setVariants((prev) => {
      const updatedVariants = [...prev];
      updatedVariants[variantIndex].attributes.push({
        size: "",
        stock: 0,
        price: 0,
      });
      return updatedVariants;
    });
  }, []);

  const deleteAttribute = useCallback(
    (variantIndex: number, attrIndex: number) => {
      setVariants((prev) => {
        const updatedVariants = [...prev];
        updatedVariants[variantIndex].attributes.splice(attrIndex, 1);
        return updatedVariants;
      });
    },
    []
  );
  const validateVariants = useCallback(() => {
    const newErrors: string[] = [];
    variants.forEach((variant, vIndex) => {
      if (!variant.color.trim())
        newErrors.push(`Variant ${vIndex + 1}: Color is required.`);
      if (!variant.images.length)
        newErrors.push(
          `Variant ${vIndex + 1}: At least one image is required.`
        );
      variant.attributes.forEach((attr, aIndex) => {
        if (!attr.size.trim())
          newErrors.push(
            `Variant ${vIndex + 1}, Attribute ${aIndex + 1}: Size is required.`
          );
        if (attr.stock < 0)
          newErrors.push(
            `Variant ${vIndex + 1}, Attribute ${
              aIndex + 1
            }: Stock must be >= 0.`
          );
        if (attr.price < 0)
          newErrors.push(
            `Variant ${vIndex + 1}, Attribute ${
              aIndex + 1
            }: Price must be >= 0.`
          );
      });
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [variants]);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data } = await AxiosBase.post(
        "/api/admin/product/createvariant",
        {
          variantData: variants,
          productId,
        }
      );
      if (!data.success)
        throw new Error(data.message || "Unknown error occurred.");
      return data;
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
    },
    onError: (error: { response: any; message: any }) => {
      console.error("API Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  useEffect(() => {
    validateVariants();
  }, [variants, validateVariants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVariants()) return;
    mutate();
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
              disabled={variantIndex === 0}
              onClick={() => deleteVariant(variantIndex)}
              className={cn(
                "absolute top-2 right-2 rounded-full text-red-500 hover:text-red-700",
                variantIndex === 0 && "hidden"
              )}
            >
              <RxCross2 color="red" />
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

            <ImageUpload
              onImagesChange={(url) => handleImageState(url, variantIndex)}
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
                  disabled={attrIndex === 0}
                  type="button"
                  onClick={() => deleteAttribute(variantIndex, attrIndex)}
                  className={cn(
                    "absolute top-2 right-2 rounded-full text-red-500 hover:text-red-700",
                    attrIndex === 0 && "hidden"
                  )}
                >
                  <RxCross1 />
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
                />
                <label className="block mb-2 text-gray-600 dark:text-gray-300">
                  Price:
                </label>
                <input
                  name="price"
                  type="number"
                  value={attr.price}
                  onChange={(e) =>
                    handleInputChange(e, variantIndex, attrIndex)
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            ))}
            <Button
              type="button"
              variant={"outline"}
              className="mt-2"
              onClick={() => addAttribute(variantIndex)}
            >
              Add Attribute
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addVariant}>
          Add Variant
        </Button>

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </section>
  );
};

export default ProductVariant;
