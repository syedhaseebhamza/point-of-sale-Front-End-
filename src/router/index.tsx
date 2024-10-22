import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

export default function RouterView() {
  return <RouterProvider router={routes} />;
}
