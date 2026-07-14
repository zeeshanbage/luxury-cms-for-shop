import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import AdminPanel from "@/pages/AdminPanel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // Secret admin route — not linked in public UI
  {
    path: "/admin",
    element: <AdminPanel />,
  },
]);
