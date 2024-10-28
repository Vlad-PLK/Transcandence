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
import UserGameWindow from "./game_jsx/UserGameWindow";
import ProtectedRoute from "./ProtectedRoute";
import UserHomePage from "./UserHomePage";
import UserFriends from "./UserFriends";
import UserGameSetup from "./UserGameSetup";
import UserGameEnd from "./game_jsx/UserGameEnd_TV";
import TournamentStats from "./game_jsx/tournamentStats";
import UserFriendPage from "./UserFriendPage";
import OAuth from "./OAuth"

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
                path: "userGameEnd/",
                element: (
                    <ProtectedRoute>
                        <UserGameEnd/>
                    </ProtectedRoute>
                )
            },
            {
                path: "tournamentStats/",
                element: (
                    <ProtectedRoute>
                        <TournamentStats/>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGameWindow/",
                element: (
                    <ProtectedRoute>
                        <UserGameWindow/>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGameSetup/",
                element: (
                    <ProtectedRoute>
                        <UserGameSetup/>
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
            },
            {
                path: "userFriendPage/",
                element: (
                    <ProtectedRoute>
                        <UserFriendPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "oauth_callback/",
                element: (
                        <OAuth/>
                )
            }
        ]
    }
]);

export default router