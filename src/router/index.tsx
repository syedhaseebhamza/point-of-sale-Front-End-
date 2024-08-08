import { RouterProvider } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { nonAuthRoutes, authRoutes } from "./routes";

const user = useAppSelector((state) => state.auth);

export default function RouterView() {
  return <RouterProvider router={nonAuthRoutes} />;
}
