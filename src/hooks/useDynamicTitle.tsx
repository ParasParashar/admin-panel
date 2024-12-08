import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useDynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const title =
      path === "/"
        ? "Dashboard - Store Admin"
        : `${path
            .replace("/", "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())} - Store Admin`;

    document.title = title;
  }, [location]);
};

export default useDynamicTitle;
