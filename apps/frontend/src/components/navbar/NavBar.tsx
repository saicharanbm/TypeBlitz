import Icon from "./Icon";

function NavBar() {
  return (
    <nav className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="w-12 md:w-16 lg:w-20 xl:w-24">
          <Icon />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#d7d6ce] font-bold">
          TypeBlitz
        </h1>
      </div>
    </nav>
  );
}

export default NavBar;
