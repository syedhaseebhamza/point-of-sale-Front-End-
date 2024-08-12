import Layout from "@/components/layout";
import Counter from "@/pages/Counter";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { Navigate, createBrowserRouter as Router } from "react-router-dom";

export const nonAuthRoutes = Router([
  {
    path: "*",
    element: <Navigate to="/counter" replace />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
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
    ],
  },
]);

export const authRoutes = Router([
  {
    path: "/login",
    element: <Login />,
  },
]);
