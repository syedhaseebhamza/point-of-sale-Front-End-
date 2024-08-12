import React from "react";
import { NavLink } from "react-router-dom";

const arr = [
  { menuName: "User Management", path: "/user", id: 2 },
  { menuName: "Settings", path: "/about", id: 4 },
];

function Home() {
  const username = localStorage.getItem("username");

  return (
    <div className="bg-[#36bc88] flex flex-col items-center  min-h-screen">
      <div className="text-white text-center mb-8">
        <h1 className="text-[14px] font-thin italic pt-[1rem]">
          Welcome {username ? username : "Guest"}
        </h1>
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col gap-[2rem]">
        {arr.map((item) => (
          <div key={item.id} className="text-center mb-4">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `text-[10px] font-bold italic p-4 rounded-lg shadow-lg cursor-pointer ${
                  isActive
                    ? "bg-[#4a4a9c] text-white"
                    : "bg-[#6e6eb4] text-white"
                }`
              }
            >
              {item.menuName}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
