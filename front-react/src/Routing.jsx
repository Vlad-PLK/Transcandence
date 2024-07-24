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
import HomePageKnown from "./HomeKnown";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root><Outlet/></Root>,
        errorElement: <Error404/>,
        children: [
            {
                path: "",
                element: <Menu/>
            },
            {
                path: "userhome/:id",
                element: (
                    <ProtectedRoute>
                        <HomePageKnown/>
                    </ProtectedRoute>
                )
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
                        <MyScene/>
                )
            }
        ]
    }
]);

export default router