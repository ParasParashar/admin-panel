import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AxiosBase from "@/lib/axios";
import ImageUpload from "./ImageUpload";
import { cn } from "@/lib/utils";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { Loader, Plus } from "lucide-react";
import { useParams } from "react-router-dom";

type Props = {
  defaultVariants?: Variant[];
  mode: "create" | "edit";
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

const ProductVariant = ({ defaultVariants = [], mode }: Props) => {
  const [variants, setVariants] = useState<Variant[]>(
    mode === "edit"
      ? defaultVariants
      : [
          {
            color: "",
            images: [],
            attributes: [{ size: "", stock: 0, price: 0 }],
          },
        ]
  );
  const queryClient = useQueryClient();
  const { id: productId } = useParams();
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

  const deleteVariant = useCallback(
    (variantIndex: number) => {
      if (mode === "create") {
        setVariants((prev) =>
          prev.filter((_, index) => index !== variantIndex)
        );
        return;
      }
      // Check if the variant has valid attributes (not empty)
      const variant = variants[variantIndex];
      const isBlankVariant =
        !variant.color.trim() &&
        variant.attributes.every((attr) => !attr.size.trim());

      if (isBlankVariant) {
        // Only allow deletion if the variant is blank
        setVariants((prev) =>
          prev.filter((_, index) => index !== variantIndex)
        );
      } else {
        toast.error(
          "You can't delete a variant that has already been created."
        );
      }
    },
    [variants]
  );

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
      if (mode === "create") {
        setVariants((prev) => {
          const updatedVariants = [...prev];
          updatedVariants[variantIndex].attributes.splice(attrIndex, 1);
          return updatedVariants;
        });
      } else {
        const variant = variants[variantIndex];
        const isBlankVariant =
          !variant.color.trim() &&
          variant.attributes.every((attr) => !attr.size.trim());

        if (isBlankVariant) {
          setVariants((prev) => {
            const updatedVariants = [...prev];
            updatedVariants[variantIndex].attributes.splice(attrIndex, 1);
            return updatedVariants;
          });
        } else {
          toast.error(
            "You can't delete a attribute that has already been created."
          );
        }
      }
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

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async () => {
      const endpoint =
        mode === "create"
          ? "/api/admin/product/createvariant"
          : `/api/admin/product/update/variant/${productId}`;

      const payload = {
        variantData: variants,
        productId,
      };

      const { data } = await AxiosBase.post(endpoint, payload);

      if (!data.success)
        throw new Error(data.message || "Unknown error occurred.");
      return data;
    },
    onSuccess: () => {
      toast.success(
        mode === "create"
          ? "Product variants created successfully!"
          : "Product variants updated successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
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
    if (mode === "edit") {
      validateVariants();
    }
  }, [variants, validateVariants, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVariants()) return;
    mutate();
  };

  return (
    <section className="w-full dark:bg-gray-800  rounded-md">
      <h3 className="text-xl font-semibold px-2 text-gray-800 dark:text-gray-200 mt-6 ">
        {mode === "create"
          ? "Create Product Variants"
          : "Edit Product Variants"}
      </h3>

      {errors.length > 0 && (
        <div className="mb-4 p-4 text-red-600 bg-red-100 border border-red-400 rounded-md">
          <ul className="list-disc pl-6">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <span className="text-xs px-2 text-muted-foreground ">
        Atleast one variant is required
      </span>
      <form
        onSubmit={handleSubmit}
        className=" grid grid-cols-1  mt-2 lg:grid-cols-2 2xl:grid-cols-3 w-full gap-2"
      >
        {variants.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className="p-3 rounded-md bg-white shadow-lg relative  w-full h-full border"
          >
            <Button
              size={"icon"}
              variant={"ghost"}
              type="button"
              disabled={mode === "create" && variants.length === 1}
              onClick={() => deleteVariant(variantIndex)}
              className={cn(
                "absolute top-2 right-2 rounded-full text-red-500 hover:text-red-700"
              )}
            >
              <RxCross2 size={15} color="red" />
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
              initialImages={variant.images}
            />

            <p className="text-sm font-semibold text-gray-800 my-3 dark:text-gray-200 mb-4">
              Attributes
            </p>
            <p className="text-xs text-muted-foreground">
              Atleast one attribute is compulsory
            </p>
            <div className="grid grid-cols-2  w-full gap-1">
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
                    autoCapitalize="words"
                    type="text"
                    value={attr.size}
                    onChange={(e) =>
                      handleInputChange(e, variantIndex, attrIndex)
                    }
                    className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    placeholder="Enter size (e.g., Small)"
                  />

                  <label className="block mb-2 text-gray-600 dark:text-gray-300">
                    Stock:
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min={0}
                    value={attr.stock}
                    onChange={(e) =>
                      handleInputChange(e, variantIndex, attrIndex)
                    }
                    className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    placeholder="Enter stock"
                  />

                  <label className="block mb-2 text-gray-600 dark:text-gray-300">
                    Price:
                  </label>
                  <input
                    name="price"
                    type="number"
                    min={0}
                    value={attr.price}
                    onChange={(e) =>
                      handleInputChange(e, variantIndex, attrIndex)
                    }
                    className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    placeholder="Enter price"
                  />
                </div>
              ))}
            </div>

            <Button
              variant={"outline"}
              type="button"
              onClick={() => addAttribute(variantIndex)}
              className="text-sky-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Attribute
            </Button>
          </div>
        ))}

        <div className="space-y-4">
          <Button
            disabled={isPending}
            variant={"outline"}
            type="button"
            onClick={addVariant}
            className="w-full text-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader className="animate-spin" />
            ) : mode === "create" ? (
              "Create Variants"
            ) : (
              "Update Variants"
            )}
          </Button>
          {isError && (
            <span className="text-xs text-red-500">
              Error: {error?.message}
            </span>
          )}{" "}
        </div>
      </form>
    </section>
  );
};

export default ProductVariant;
