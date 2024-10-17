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
  faDollarSign,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../common/button";
import { SwitchIcon } from "../ui-icons";

const sideBarMenu = [
  { menuName: "User Management", path: "/user", icon: faUser },
  { menuName: "Role Permission", path: "/rolepermission", icon: faKey },
  { menuName: "Category", path: "/category", icon: faList },
  { menuName: "Item", path: "/item", icon: faUtensils },
  { menuName: "Deals", path: "/deals", icon: faTags },
  { menuName: "Sales", path: "/sales", icon: faDollarSign },
  { menuName: "Order", path: "/order", icon: faShoppingCart },
  { menuName: "Menu", path: "/menu", icon: faBars },
];

function Sidebar({ sidebarWidth }: any) {
  const navigate = useNavigate();

  return (
    <div
      className={`p-8 flex flex-col justify-between ${
        sidebarWidth ? "items-center" : ""
      }  min-h-screen `}
    >
      <div>
        <ul className="space-y-4">
          {sideBarMenu.map((menuItem) => (
            <li key={menuItem.path}>
              <NavLink
                to={menuItem.path}
                className={({ isActive }) =>
                  `p-3 rounded-[14px] flex gap-8 items-center ${
                    isActive ? " bg-white text-primary hover:bg-hover_primary" : "hover:bg-hover_primary"
                  }`
                }
              >
                <div>
                  <FontAwesomeIcon icon={menuItem.icon} size="lg" />
                </div>
                <span
                  className={`flex-grow  font-bold ${
                    sidebarWidth ? "hidden" : ""
                  }`}
                >
                  {menuItem.menuName}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        {sidebarWidth ? (
          <div className="hover:bg-hover_primary p-3 rounded-[14px]  cursor-pointer">
            <SwitchIcon />
          </div>
        ) : (
          <div>
            <Button
              label="Logout"
              className="bg-secondary text-white hover:bg-white hover:text-secondary "
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
