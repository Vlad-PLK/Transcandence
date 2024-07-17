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
import Home from "./Home";
import MyScene from "./MyScene";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root><Outlet/></Root>,
        errorElement: <Error404/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "user/:id",
                element: (
                    <ProtectedRoute>
                        <Settings/>
                    </ProtectedRoute>
                )
            },
            {
                path: "game",
                element: (
                    <ProtectedRoute>
                        <MyScene/>
                    </ProtectedRoute>
                )
            }
        ]
    }
]);

export default router