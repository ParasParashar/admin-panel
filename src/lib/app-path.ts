// Menu items.
import { Settings } from "lucide-react";
import { TbCategoryPlus } from "react-icons/tb";
import { BsBarChartLine } from "react-icons/bs";



export const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: BsBarChartLine,
    },
    {
        title: "Category",
        url: "/category",
        icon: TbCategoryPlus,
    },
    {
        title: "Products",
        url: "/product",
        icon: Settings,
    },
];
