import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full px-3 p-2">
        <nav className="   p-1  w-full ">
          <SidebarTrigger />
        </nav>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
