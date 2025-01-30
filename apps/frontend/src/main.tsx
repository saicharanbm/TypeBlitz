import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import GameArea from "./components/GameArea.tsx";
import Multiplayer from "./components/multiplayer/Multiplayer.tsx";
import { Bounce, ToastContainer, Zoom } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <GameArea />,
      },
      {
        path: "/ws",
        element: <Multiplayer />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      className={"bg-bgColor text-textPrimary"}
      position="top-right"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      theme="colored"
      transition={Zoom}
    />
    <RouterProvider router={router} />
  </StrictMode>
);
