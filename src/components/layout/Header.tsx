import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { FC } from "react";

interface HeaderProps {
  sidebarWidth: boolean;
  setSidebarWidth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: FC<HeaderProps> = ({ sidebarWidth, setSidebarWidth }) => {
  return (
    <div
      className="bg-cover bg-center shadow-xl h-24 flex items-center justify-between p-8"
    >
      <div className="flex items-center gap-2">
        {sidebarWidth ? (
          <div
            className="cursor-pointer"
            onClick={() => setSidebarWidth(false)}
          >
            <MenuIcon
              sx={{ height: "3rem !important", width: "3rem !important" }}
            />
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setSidebarWidth(true)}>
            <MenuOpenIcon
              sx={{ height: "3rem !important", width: "3rem !important" }}
            />
          </div>
        )}

        <div className="font-bold text-2xl">
              Welcome to CodeSync Resturent
      </div>
      </div>

    </div>
  );
};

export default Header;
