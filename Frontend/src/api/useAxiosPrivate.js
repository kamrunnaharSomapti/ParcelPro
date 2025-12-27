import { useEffect } from "react";
import { api } from "./client";
import { useAuth } from "../hooks/useAuth";

export function useAxiosPrivate() {
    const { auth, logout } = useAuth();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                const token = auth?.token;
                if (token && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {// If token invalid/expired → log out for clean UX
                const status = error?.response?.status;
                if (status === 401) logout();
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [auth?.token, logout]);

    return api;
}
