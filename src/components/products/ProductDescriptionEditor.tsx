import { Suspense, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Skeleton } from "../ui/skeleton";
import ReactQuill from "react-quill";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";
import { MdPreview } from "react-icons/md";

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: "" }, { align: "center" }, { align: "right" }],
      ["link"],
      ["clean"],
      ["html"],
    ],
    handlers: {
      html: function () {
        const customHtml = prompt("Enter custom HTML to inject:");
        if (customHtml) {
          const quill = this.quill;
          const range = quill.getSelection();
          quill.clipboard.dangerouslyPasteHTML(range.index, customHtml);
        }
      },
    },
  },
};

type props = {
  onSelect: (e: string) => void;
  prevDescriptor: string;
};

const ProductDescriptionEditor = ({ onSelect, prevDescriptor }: props) => {
  const [description, setDescription] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    setDescription(prevDescriptor);
  }, [prevDescriptor]);

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
    onSelect(content);
  };

  const togglePreview = (e: any) => {
    e.preventDefault();
    setIsPreview(!isPreview);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Product Description</h3>
      <Button
        size={"icon"}
        onClick={togglePreview}
        type="button"
        className="mb-4 px-4 py-2 "
      >
        {isPreview ? (
          <span className="text-xs flex items-center gap-1">
            <PencilIcon />
          </span>
        ) : (
          <MdPreview />
        )}
      </Button>

      {isPreview ? (
        <ReactQuill
          value={description}
          theme="bubble"
          readOnly
          className="text-[14px]"
        />
      ) : (
        <Suspense
          fallback={
            <div className="h-full w-full">
              <Skeleton className="h-10 p-2 w-full mb-1" />
              <Skeleton className="aspect-video" />
            </div>
          }
        >
          <ReactQuill
            ref={quillRef}
            value={description}
            onChange={handleDescriptionChange}
            modules={modules}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "align",
              "link",
              "image",
            ]}
            placeholder="Write your product description..."
          />
        </Suspense>
      )}
    </div>
  );
};

export default ProductDescriptionEditor;
