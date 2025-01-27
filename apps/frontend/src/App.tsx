import NavBar from "./components/navbar/NavBar";
import Home from "./components/Home";
function App() {
  return (
    <div className="max-w-[1400px] min h-screen mx-auto pt-12 px-4 sm:px-6 lg:px-12 font-robotoSans">
      <NavBar />
      <Home />
    </div>
  );
}

export default App;
