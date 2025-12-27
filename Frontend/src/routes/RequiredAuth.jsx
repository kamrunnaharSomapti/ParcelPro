import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function RequireAuth() {
    const { auth } = useAuth();
    if (!auth?.token) return <Navigate to="/login" replace />;
    return <Outlet />;
}
