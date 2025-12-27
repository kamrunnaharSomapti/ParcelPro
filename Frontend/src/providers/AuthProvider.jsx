import React, { useEffect, useMemo, useState } from "react";
import AuthContext from "../context/AuthContext";

const STORAGE_KEY = "courier_auth";

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { user: null, token: null };
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    }, [auth]);

    const logout = () => {
        setAuth({ user: null, token: null });
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(() => ({ auth, setAuth, logout }), [auth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}