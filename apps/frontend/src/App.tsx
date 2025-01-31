import Footer from "./components/Footer";
import NavBar from "./components/navbar/NavBar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="max-w-[1400px] min h-screen mx-auto pt-12 px-4 sm:px-6 lg:px-12 font-robotoSans flex flex-col">
      <NavBar />
      <div className="flex-grow w-full ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
