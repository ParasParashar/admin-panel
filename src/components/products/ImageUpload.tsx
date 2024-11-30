import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { RxCross1 } from "react-icons/rx";
import { CiImageOn } from "react-icons/ci";
import AxiosBase from "@/lib/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type ImageUploadProps = {
  onImagesChange: (images: string[]) => void;
  initialImages: string[];
};

const ImageUpload = ({ onImagesChange, initialImages }: ImageUploadProps) => {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const { id: productId } = useParams();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<string[]>(
    initialImages ? initialImages : []
  );
  const [img, setImg] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      try {
        const { data } = await AxiosBase.post("/api/image/upload", { img });
        if (data.error) throw new Error(data.error || "Error creating upload");
        const updatedImages = [...selectedImages, data.img];
        setSelectedImages(updatedImages);
        onImagesChange(updatedImages);
        toast.success("Image uploaded successfully");
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
      } catch (error: any) {
        console.log("Error uploading images", error);
        toast.error("Error in uploading image Please try again");
      } finally {
        setLoading(false);
      }
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = async (index: number) => {
    const imageToRemove = selectedImages[index];
    setLoading(true);
    const updatedImages = selectedImages.filter((_, i) => i !== index);

    setSelectedImages(updatedImages);
    onImagesChange(updatedImages);

    try {
      const { data } = await AxiosBase.post("/api/image/destroy", {
        imageToRemove,
      });
      if (data.error) throw new Error(data.error || "Error deleting image");
      setSelectedImages(updatedImages);
      queryClient.invalidateQueries({ queryKey: ["product", productId] });

      toast.success(data.message);
    } catch (error) {
      console.log("Error deleting images", error);
      toast.error("Error deleting images");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData("imageIndex", index.toString());
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("imageIndex"), 10);

    if (draggedIndex !== targetIndex) {
      const updatedImages = [...selectedImages];
      const [draggedImage] = updatedImages.splice(draggedIndex, 1);
      updatedImages.splice(targetIndex, 0, draggedImage);

      setSelectedImages(updatedImages);
      onImagesChange(updatedImages);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <label className="block mb-2 text-gray-600 dark:text-gray-300">
        Upload Images:
      </label>
      <CiImageOn
        className=" text-blue-500 cursor-pointer"
        size={50}
        onClick={() => imgRef?.current?.click()}
      />
      <input
        ref={imgRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleImgChange}
        disabled={loading}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
      />
      {loading && <p className="text-blue-500 mb-2">Uploading...</p>}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {selectedImages.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="relative transition-all duration-500 group ease-in-out cursor-grab"
            >
              <img
                src={image}
                alt={`Uploaded Preview ${index + 1}`}
                className="aspect-square hover:scale-105 transition-all duration-300 ease-in-out object-cover rounded-md shadow-md"
              />
              <span className="text-center text-xs mx-auto text-muted-foreground">
                {index + 1}
              </span>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => handleRemoveImage(index)}
                className="absolute top-[-10px] border-2 right-[-10px] text-white border-none group-hover:bg-red-400 ring-0 rounded-full hover:bg-red-400"
              >
                <RxCross1 size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs mt-3 text-muted-foreground">
        You can upload multiple images one by one. Drag images to reorder them.
      </p>
    </div>
  );
};

export default ImageUpload;
