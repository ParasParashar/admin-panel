import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col bg-secondary">
        <nav className=" sticky top-1 inset-x-0    z-30 backdrop-blur-lg border-b-2 border-muted-secondary  rounded-l-lg    p-1  w-full ">
          <SidebarTrigger />
        </nav>
        <div className="p-2 px-3  lg:p-3">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
