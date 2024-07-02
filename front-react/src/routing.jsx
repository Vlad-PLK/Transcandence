import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet
} from "react-router-dom";
import Root from "./root";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root><Outlet/></Root>,
        children: [
            // {
                // path: "",
                // element:
                // // element: <Home/>,
            // }
        ]
    }
]);

export default router