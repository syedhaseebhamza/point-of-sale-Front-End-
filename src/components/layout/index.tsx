import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState<boolean>(true);

  return (
    <div className="flex">
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarWidth ? "w-0 opacity-0" : "w-1/5"
        } bg-[#646745f4] h-screen`}
      >
        <Sidebar />
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarWidth ? "w-full" : "w-4/5"
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
