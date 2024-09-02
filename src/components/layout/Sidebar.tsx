import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faList,
  faUtensils,
  faTags,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button";

const sideBarMenu = [
  { menuName: "User Management", path: "/user", icon: faUser },
  { menuName: "Role Permission", path: "/rolepermission", icon: faKey },
  { menuName: "Category", path: "/category", icon: faList },
  { menuName: "Item", path: "/item", icon: faUtensils },
  { menuName: "Deals", path: "/deals", icon: faTags },
  { menuName: "Menu", path: "/menu", icon: faBars },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="p-8 flex flex-col justify-between min-h-screen">
    <div>
      <ul className="space-y-4">
        {sideBarMenu.map((menuItem) => (
          <li key={menuItem.path}>
            <NavLink
              to={menuItem.path}
              className={({ isActive }) =>
                `p-2 rounded flex gap-8 items-center${
                  isActive ? "bg-white text-black" : "hover:bg-[#FFF1CD]"
                }`
              }
            >
              <div>
                <FontAwesomeIcon icon={menuItem.icon} size="lg" />
              </div>
              <span className="flex-grow">{menuItem.menuName}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
    <div>
        <Button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
            window.location.href = "/login";
          }}
          label="Logout"
          className="bg-secondary text-white hover:bg-white hover:text-secondary "
        />
      </div>
    </div>
  );
}

export default Sidebar;
