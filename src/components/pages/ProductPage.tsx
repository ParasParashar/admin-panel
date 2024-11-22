import { useState } from "react";
import ProductCreation from "../products/ProductCreation";
import { Button } from "../ui/button";

enum STEPS {
  CREATE = 0,
  VARIANT = 1,
  PUBLISH = 2,
}

const ProductPage = () => {
  const [step, setStep] = useState(STEPS.CREATE);

  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
    setStep((value) => value + 1);
  };

  let content;
  if (step === STEPS.CREATE) {
    content = <ProductCreation />;
  }
  if (step === STEPS.VARIANT) {
    content = (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
          Add Product Variants
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure variants for your product here.
        </p>
      </div>
    );
  }
  if (step === STEPS.PUBLISH) {
    content = (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
          Ready to Publish
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review all details before publishing your product.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-3xl mx-auto p-3 px-5">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Product Management
        </h1>
      </div>
      <div className="mt-6 flex flex-col w-full items-center justify-center">
        <div className="flex w-full justify-between">
          <Button
            onClick={onBack}
            disabled={step === STEPS.CREATE}
            className={`${
              step === STEPS.CREATE
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600"
            } px-4 py-2 text-white rounded-md`}
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={step === STEPS.PUBLISH}
            className={`${
              step === STEPS.PUBLISH
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600"
            } px-4 py-2 text-white rounded-md`}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {Object.values(STEPS)
            .filter((value) => typeof value === "number") // Only map numeric values
            .map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full ${
                  step === index
                    ? "bg-blue-500 dark:bg-blue-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
        </div>
      </div>
      <div className="mb-1">{content}</div>
    </div>
  );
};

export default ProductPage;
