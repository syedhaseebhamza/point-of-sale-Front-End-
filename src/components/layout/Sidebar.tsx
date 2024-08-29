import Home from "@/pages/Home";
import React from "react";
import { NavLink } from "react-router-dom";

const sideBarMenu = [
  { menuName: "User Management", path: "/user" },
  { menuName: "Role Permission", path: "/rolepermission" },
  { menuName: "Catagary", path: "/catagary" },
  { menuName: "Item", path: "/item" },
  { menuName: "Deals", path: "/deals" },
  { menuName: "Menu", path: "/menu" },
];

function Sidebar() {
  return (
    <div className="p-[1rem] ">
      <ul className="space-y-4">
        {sideBarMenu.map((menuItem) => (
          <li key={menuItem.path}>
            <NavLink
              to={menuItem.path}
              className={({ isActive }) =>
                `block p-2 rounded text-center ${
                  isActive ? "bg-white text-black" : "hover:bg-[#FFF1CD]"
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
