import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div>
      <div className="flex h-[100vh]">
        <div className="min-w-[25rem]">
          <Sidebar />
        </div>

        <div className="w-full flex flex-col justify-between">
          <Header />
          <div className="">
            <Outlet />
          </div>
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
