// import LoadingSpinner from "./LoadingSpinner";

import { Loader } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default PageLoader;
