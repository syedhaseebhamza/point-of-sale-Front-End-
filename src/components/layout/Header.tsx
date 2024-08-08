import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <div
      className="flex items-center gap-4 py-6 px-4 justify-center font-bold text-[18px] text-p
         w-full bg-slate-300"
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
