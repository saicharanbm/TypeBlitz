import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen  text-white px-4">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-[#e2b714] mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-300 mb-2">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Oops! It seems you've wandered off the map.
        </p>

        {/* Animated Face */}
        <div className="flex justify-center items-center mb-6">
          <div className="w-36 h-36 relative rounded-full flex items-center justify-center border-4 border-[#e2b714] shadow-lg">
            <div className="absolute top-6 left-8 w-6 h-6 bg-[#e2b714] rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-8 w-6 h-6 bg-[#e2b714] rounded-full animate-pulse"></div>
            <div className="absolute top-20 w-24 h-14 border-4 border-transparent border-t-[#e2b714] rounded-t-full"></div>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Let’s guide you back to safety.{" "}
          <Link
            to="/"
            className="text-[#e2b714] underline transition duration-300 hover:text-yellow-400"
          >
            Go Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
