import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthContext";

export function useAuth() {
    const authContext = useContext(AuthContext);
    useDebugValue(authContext?.auth, (a) => (a?.token ? "Logged in" : "Logged out"));
    if (!authContext) throw new Error("useAuth must be used inside AuthProvider");
    return authContext;
}
