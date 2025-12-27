import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function RequireRole({ allowed }) {
    const { auth } = useAuth();
    const role = auth?.user?.role;

    if (!auth?.token) return <Navigate to="/login" replace />;
    if (!allowed.includes(role)) return <Navigate to="/unauthorized" replace />;
    return <Outlet />;
}
