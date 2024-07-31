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
import WelcomePage from "./WelcomePage";
import UserSettings from "./UserSettings";
import Error404 from "./Error404";
import UserGame from "./game_jsx/UserGame";
import ProtectedRoute from "./ProtectedRoute";
import UserHomePage from "./UserHomePage";
import UserFriends from "./UserFriends";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root><Outlet/></Root>,
        errorElement: <Error404/>,
        children: [
            {
                path: "",
                element: <WelcomePage/>
            },
            {
                path: "userPage/",
                element: (
                    <ProtectedRoute>
                        <UserHomePage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "userSettings/",
                element: (
                    <ProtectedRoute>
                        <UserSettings/>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGame/",
                element: (
                    <ProtectedRoute>
                        <UserGame/>
                    </ProtectedRoute>
                )
            },
            {
                path: "userFriends/",
                element: (
                    <ProtectedRoute>
                        <UserFriends/>
                    </ProtectedRoute>
                )
            }
        ]
    }
]);

export default router