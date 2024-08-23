import Home from "@/pages/Home";
import React from "react";
import { NavLink } from "react-router-dom";

const sideBarMenu = [
  { menuName: "User Management", path: "/user" },
  { menuName: "Role Permission", path: "/rolepermission" },
];

function Sidebar() {
  return (
    <div className="p-[1rem] ">
      {/* <img src="/public/pizzeri.jpg" alt="no imag" /> */}
      <ul className="space-y-4">
        {sideBarMenu.map((menuItem) => (
          <li key={menuItem.path}>
            <NavLink
              to={menuItem.path}
              className={({ isActive }) =>
                `block p-2 rounded text-center ${
                  isActive ? "bg-gray-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              {menuItem.menuName}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
