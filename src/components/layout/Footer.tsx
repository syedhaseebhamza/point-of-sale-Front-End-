import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <div
      className="flex items-center flex-col gap-4 py-6 px-4 justify-center font-bold text-[16px] text-p
         w-full bg-slate-700"
    >
      <NavLink
        to="/"
        className={({ isActive }) => `${isActive && "text-red-600"}`}
      >
        Home
      </NavLink>
      <NavLink
        to="counter"
        className={({ isActive }) => `${isActive && "text-red-600"}`}
      >
        Counter
      </NavLink>

      <NavLink
        to="about"
        className={({ isActive }) => `${isActive && "text-red-600"}`}
      >
        About
      </NavLink>
    </div>
  );
}
