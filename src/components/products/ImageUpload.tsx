import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { RxCross1 } from "react-icons/rx";
import { CiImageOn } from "react-icons/ci";

type ImageUploadProps = {
  onImagesChange: (images: string[]) => void;
};

type UploadedImage = {
  url: string;
  publicId: string;
};

const ImageUpload = ({ onImagesChange }: ImageUploadProps) => {
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecommerce");
    formData.append("cloud_name", "dxeknmtjw");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_CLOUDINARY_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url && data.public_id) {
        const updatedImages = [
          ...selectedImages,
          { url: data.secure_url, publicId: data.public_id },
        ];
        setSelectedImages(updatedImages);
        onImagesChange(updatedImages.map((image) => image.url));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = selectedImages[index];
    const updatedImages = selectedImages.filter((_, i) => i !== index);

    setSelectedImages(updatedImages);
    onImagesChange(updatedImages.map((image) => image.url));

    // Delete the image from Cloudinary
    try {
      await fetch(import.meta.env.VITE_CLOUDINARY_URL + "/destroy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: imageToRemove.publicId,
          api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
        }),
      });
    } catch (error) {
      console.error("Error deleting image:", error);
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
      onImagesChange(updatedImages.map((image) => image.url));
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
        onChange={handleImageChange}
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
              className="relative transition-all duration-500 ease-in-out cursor-grab"
            >
              <img
                src={image.url}
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
                className="absolute top-1 right-1 text-white border-none ring-0 rounded-full hover:bg-red-500"
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
