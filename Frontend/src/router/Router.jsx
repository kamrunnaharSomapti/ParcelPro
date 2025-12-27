import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Admin from "../pages/dashboard/Admin";
import Agent from "../pages/dashboard/Agent";
import NotFound from "../pages/common/NotFound";
import RequireRole from "../routes/RequireRole";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/common/Unauthorized";
import RequiredAuth from "../routes/RequiredAuth";
import Customer from "../pages/dashboard/Customer";

export const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/unauthorized", element: <Unauthorized /> },

    {
        element: <RequiredAuth></RequiredAuth>,
        children: [
            {
                element: <RequireRole allowed={["admin"]} />,
                children: [{ path: "/admin", element: <Admin /> }],
            },
            {
                element: <RequireRole allowed={["agent"]} />,
                children: [{ path: "/agent", element: <Agent /> }],
            },
            {
                element: <RequireRole allowed={["customer"]} />,
                children: [{ path: "/customer", element: <Customer /> }],
            },
        ],
    },

    { path: "*", element: <NotFound /> },
]);
