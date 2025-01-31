import Icon from "./Icon";
import { Satellite, KeyboardIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="flex items-center mb-8 gap-6 md:gap-7 lg:gap-12">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="w-12 md:w-16 lg:w-20 xl:w-24">
          <Icon />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#d7d6ce] font-bold">
          TypeBlitz
        </h1>
      </div>
      <div className="flex gap-2 md:gap-4 ">
        <NavLink
          to={""}
          className={({ isActive }) =>
            isActive ? "text-primaryColor" : "text-textPrimary"
          }
        >
          <KeyboardIcon />
        </NavLink>
        <NavLink
          to={"/ws"}
          className={({ isActive }) =>
            isActive ? "text-primaryColor" : "text-textPrimary"
          }
        >
          <Satellite />
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
