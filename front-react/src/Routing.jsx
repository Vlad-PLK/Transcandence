import * as React from "react";
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet
} from "react-router-dom";

// Eager load critical components
import Root from "./Root";
import ProtectedRoute from "./ProtectedRoute";

// Lazy load route components for code splitting
const WelcomePage = lazy(() => import("./WelcomePage"));
const UserSettings = lazy(() => import("./UserSettings"));
const Error404 = lazy(() => import("./Error404"));
const UserGame = lazy(() => import("./game_jsx/UserGame"));
const UserGameWindow = lazy(() => import("./game_jsx/UserGameWindow"));
const UserHomePage = lazy(() => import("./UserHomePage"));
const UserFriends = lazy(() => import("./UserFriends"));
const UserGameSetup = lazy(() => import("./UserGameSetup"));
const UserGameEnd = lazy(() => import("./game_jsx/UserGameEnd_TV"));
const TournamentStats = lazy(() => import("./game_jsx/tournamentStats"));
const UserFriendPage = lazy(() => import("./UserFriendPage"));
const OAuth = lazy(() => import("./OAuth"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem',
    color: '#666'
  }}>
    Loading...
  </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root><Outlet/></Root>,
        errorElement: <Suspense fallback={<LoadingFallback/>}><Error404/></Suspense>,
        children: [
            {
                path: "",
                element: <Suspense fallback={<LoadingFallback/>}><WelcomePage/></Suspense>
            },
            {
                path: "userPage/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserHomePage/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userSettings/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserSettings/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGame/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserGame/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGameEnd/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserGameEnd/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "tournamentStats/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <TournamentStats/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGameWindow/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserGameWindow/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userGameSetup/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserGameSetup/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userFriends/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserFriends/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "userFriendPage/",
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback/>}>
                            <UserFriendPage/>
                        </Suspense>
                    </ProtectedRoute>
                )
            },
            {
                path: "oauth_callback/",
                element: (
                    <Suspense fallback={<LoadingFallback/>}>
                        <OAuth/>
                    </Suspense>
                )
            }
        ]
    }
]);

export default router