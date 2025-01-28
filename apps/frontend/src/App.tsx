import NavBar from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="max-w-[1400px] min h-screen mx-auto pt-12 px-4 sm:px-6 lg:px-12 font-robotoSans">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
