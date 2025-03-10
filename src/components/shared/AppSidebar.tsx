import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { items } from "@/lib/app-path";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSpinner } from "react-icons/fa";
import { Seller } from "@/lib/type";
import toast from "react-hot-toast";
import { LucideLogOut } from "lucide-react";
import AxiosBase from "@/lib/axios";
import TrashDropDown from "./TrashDropDown";

export function AppSidebar() {
  const navigate = useNavigate();
  const { data: authUser } = useQuery<Seller>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const { data } = await AxiosBase.post("/api/admin/seller/logout");
        if (!data.success) throw new Error(data.error);
        navigate("/login");
        return data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Logout failed");
    },
  });
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="bg-gray-100 dark:bg-gray-900"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg text-gray-800 dark:text-gray-200">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent className="py-3">
            <SidebarSeparator />

            <SidebarMenu>
              {items.map((item) => {
                const location = useLocation();
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon
                          className={`${
                            isActive ? "text-blue-500" : "text-gray-700"
                          } dark:${
                            isActive ? "text-blue-300" : "text-gray-300"
                          }`}
                        />
                        <span
                          className={`text-md font-semibold ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <footer className="mt-auto">
          <TrashDropDown />

          <SidebarSeparator />
          <SidebarFooter className="flex flex-col items-center justify-center  text-center">
            {/* User Info */}
            <SidebarMenuButton asChild>
              <Link to={"/seller"} className="flex items-center space-x-3 mb-3">
                <FaUserCircle className="w-16 h-16 text-gray-700" />
                <span className="flex flex-col items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    {authUser?.name || "User Name"}
                  </p>
                </span>
              </Link>
            </SidebarMenuButton>

            {/* Logout Button */}
            <SidebarMenuButton onClick={handleLogout}>
              {isPending ? (
                <FaSpinner className="animate-spin" size={15} />
              ) : (
                <LucideLogOut size={16} />
              )}{" "}
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarFooter>
        </footer>
      </SidebarContent>
    </Sidebar>
  );
}
