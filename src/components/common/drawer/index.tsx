import { RoundedCross } from "@/components/ui-icons";
import React, { ReactNode } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Drawer({ isOpen, onClose, children }: DrawerProps) {
  return (
    <div
      id="drawer-right-example"
      className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } bg-white w-[28rem] shadow-xl`}
      aria-labelledby="drawer-right-label"
    >
      <button
        type="button"
        aria-controls="drawer-right-example"
        onClick={onClose}
        className="text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center  dark:hover:text-white"
      >
       <RoundedCross/>
        <span className="sr-only">Close menu</span>
      </button>
      {children}
    </div>
  );
}

export default Drawer;
