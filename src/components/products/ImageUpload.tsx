// import { useState } from "react";
// import { Button } from "../ui/button";
// import { RxCross1 } from "react-icons/rx";

// type ImageUploadProps = {
//   onImagesChange: (images: File[]) => void;
// };

// const ImageUpload = ({ onImagesChange }: ImageUploadProps) => {
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);

//   //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //     // const files = Array.from(e.target.files || []);
//   //     // setSelectedImages((prev) => [...prev, ...files]);
//   //     // onImagesChange([...selectedImages, ...files]);
//   //   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const fileArray = Array.from(files); // Convert the FileList to an array
//     setSelectedImages((prev) => [...prev, ...fileArray]);

//     // Prepare FormData to send to the backend
//     const formData = new FormData();
//     fileArray.forEach((file) => formData.append("images", file)); // Append each file

//   };

//   const handleRemoveImage = (index: number) => {
//     const updatedImages = selectedImages.filter((_, i) => i !== index);
//     setSelectedImages(updatedImages);
//     onImagesChange(updatedImages);
//   };

//   const handleDragStart = (
//     e: React.DragEvent<HTMLDivElement>,
//     index: number
//   ) => {
//     e.dataTransfer.setData("imageIndex", index.toString());
//   };

//   const handleDrop = (
//     e: React.DragEvent<HTMLDivElement>,
//     targetIndex: number
//   ) => {
//     e.preventDefault();
//     const draggedIndex = parseInt(e.dataTransfer.getData("imageIndex"), 10);

//     if (draggedIndex !== targetIndex) {
//       const updatedImages = [...selectedImages];
//       const [draggedImage] = updatedImages.splice(draggedIndex, 1);
//       updatedImages.splice(targetIndex, 0, draggedImage);

//       setSelectedImages(updatedImages);
//       onImagesChange(updatedImages);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   return (
//     <div>
//       <label className="block mb-2 text-gray-600 dark:text-gray-300">
//         Upload Images:
//       </label>
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleImageChange}
//         className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
//       />
//       {selectedImages.length > 0 && (
//         <div className="grid grid-cols-3 gap-3 mt-4">
//           {selectedImages.map((image, index) => (
//             <div
//               key={index}
//               className="relative transition-all duration-500 ease-in-out"
//               draggable
//               onDragStart={(e) => handleDragStart(e, index)}
//               onDragOver={handleDragOver}
//               onDrop={(e) => handleDrop(e, index)}
//             >
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt={`Preview ${index + 1}`}
//                 className="aspect-square  cursor-grab hover:scale-105 transition-all duration-300 ease-in-out object-cover rounded-md shadow-md"
//               />
//               <Button
//                 size={"icon"}
//                 variant={"ghost"}
//                 onClick={() => handleRemoveImage(index)}
//                 className="absolute top-1 right-1 text-white    border-none ring-0 rounded-full hover:bg-red-500"
//               >
//                 <RxCross1 size={20} />
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//       <p className="text-xs mt-3 text-muted-foreground">
//         You can also drag images to different places.{" "}
//       </p>
//     </div>
//   );
// };

// export default ImageUpload;
import { useState } from "react";
import { Button } from "../ui/button";
import { RxCross1 } from "react-icons/rx";

type ImageUploadProps = {
  onImagesChange: (images: string[]) => void; // changed from File[] to string[] to store Cloudinary URLs
};

const ImageUpload = ({ onImagesChange }: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // changed to store URLs

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const uploadedImageUrls: string[] = [];

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary preset

      try {
        // Upload the image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          uploadedImageUrls.push(data.secure_url); // Store the Cloudinary URL
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setSelectedImages((prev) => [...prev, ...uploadedImageUrls]);
    onImagesChange([...selectedImages, ...uploadedImageUrls]);
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
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
      />
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className="relative transition-all duration-500 ease-in-out"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="aspect-square  cursor-grab hover:scale-105 transition-all duration-300 ease-in-out object-cover rounded-md shadow-md"
              />
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
        You can also drag images to different places.
      </p>
    </div>
  );
};

export default ImageUpload;
