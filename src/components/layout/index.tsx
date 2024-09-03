import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState<boolean>(true);

  return (
    <div className="flex h-full w-full">
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarWidth ? "w-20" : "w-1/6"
        } shadow-lg  h-screen`}
      >
        <Sidebar sidebarWidth={sidebarWidth} />
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarWidth ? "w-full" : "w-5/6"
        }`}
      >
        <Header setSidebarWidth={setSidebarWidth} sidebarWidth={sidebarWidth} />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
