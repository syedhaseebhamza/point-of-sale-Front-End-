import { RouterProvider } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { routes } from "./routes";
import { useMemo } from "react";

export default function RouterView() {
  // const user = useAppSelector((state) => state.auth);

  // const token = localStorage.getItem("token");
  // const routes = useMemo(() => {
  //   if (token) {
  //     return nonAuthRoutes;
  //   } else {
  //     return authRoutes;
  //   }
  // }, [token]);

  return <RouterProvider router={routes} />;
}
