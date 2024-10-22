import Layout from "@/components/layout";
import Catagary from "@/pages/Category";
import Counter from "@/pages/Counter";
import Deals from "@/pages/Deals";
import Home from "@/pages/Home";
import Items from "@/pages/Items";
import Login from "@/pages/Login";
import Menu from "@/pages/Menu";
import Order from "@/pages/Order";
import RolePermission from "@/pages/RolePermission";
import Sales from "@/pages/Sales";
import Setting from "@/pages/Setting";
import UserPage from "@/pages/UserPage";
import { Navigate, createBrowserRouter as Router } from "react-router-dom";


export const routes = Router([
  {
    path: "*",
    element: <div>Page not found</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />, // Redirect to /login by default
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
        path: "/category",
        element: <Catagary />,
      },
      {
        path: "/item",
        element: <Items />,
      },
      {
        path: "/deals",
        element: <Deals />,
      },
      {
        path: "/sales",
        element: <Sales />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      // {
      //   path: "/menu",
      //   element: <Menu />,
      // },
      {
        path: "/setting",
        element: <Setting />,
      },
    ],
  },
]);
