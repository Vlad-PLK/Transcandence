import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet
} from "react-router-dom";
import Root from "./Root";
import Menu from "./Menu";
import Settings from "./Settings";
import Error404 from "./Error404";
import HomePage from "./HomePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root><Outlet/></Root>,
        errorElement: <Error404/>,
        children: [
            {
                path: "",
                element: <HomePage/>
            },
            {
                path: "user:id",
                element: <Settings/>
            },
            {
                path: "game",
                element: <div>Game Page</div>
            }
        ]
    }
]);

export default router