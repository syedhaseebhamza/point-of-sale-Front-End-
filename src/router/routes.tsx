import Layout from "@/components/layout";
import Counter from "@/pages/Counter";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Menu from "@/pages/Menu";
import RolePermission from "@/pages/RolePermission";
import UserPage from "@/pages/UserPage";
import { Navigate, createBrowserRouter as Router } from "react-router-dom";

export const nonAuthRoutes = Router([
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      // {
      //   path: "/",
      //   element: <Home />,
      // },
      {
        path: "/about",
        element: (
          <div>about page go back to couter page to see data presists</div>
        ),
      },
      {
        path: "/counter",
        element: <Counter />,
      },
      {
        path: "/user",
        element: <UserPage />,
      },
      {
        path: "/rolepermission",
        element: <RolePermission />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
    ],
  },
]);

export const authRoutes = Router([
  {
    path: "/login",
    element: <Login />,
  },
]);
