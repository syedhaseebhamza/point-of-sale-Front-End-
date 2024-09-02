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
      style={{
        backgroundImage:
          "url('https://beyondtype1.org/wp-content/uploads/2023/01/FAST-FOOD-CHAIN-NUTRITION-GUIDE-HEADER.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        // filter: "blur(1.8px)",
      }}
      className="bg-cover bg-center  h-24 flex items-center justify-between p-8"
    >
      <div className="flex gap-2">
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
      </div>

    </div>
  );
};

export default Header;
