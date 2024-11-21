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
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import { Seller } from "@/lib/type";
import toast from "react-hot-toast";
import { LucideLogOut } from "lucide-react";
import AxiosBase from "@/lib/axios";

export function AppSidebar() {
  const navigate = useNavigate();
  const { data: authUser } = useQuery<Seller>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const { data } = await AxiosBase.post("/auth/logout");
        if (data.error) throw new Error(data.error);
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="text-gray-700 dark:text-gray-300" />
                      <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <footer className="mt-auto">
          <SidebarSeparator />
          <SidebarFooter className="flex flex-col items-center justify-center  text-center">
            {/* User Info */}
            <SidebarMenuButton asChild>
              <div className="flex items-center space-x-3 mb-3">
                <FaUserCircle className="w-16 h-16 text-gray-700" />
                <span className="flex flex-col items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    {authUser?.name || "User Name"}
                  </p>
                </span>
              </div>
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
