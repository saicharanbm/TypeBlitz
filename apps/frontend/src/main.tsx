import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import GameArea from "./components/GameArea.tsx";
import Multiplayer from "./components/multiplayer/Multiplayer.tsx";
import { ToastContainer, Zoom } from "react-toastify";
import PageNotFound from "./components/PageNotFound.tsx";

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
  {
    path: "/*",
    element: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={1000}
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
