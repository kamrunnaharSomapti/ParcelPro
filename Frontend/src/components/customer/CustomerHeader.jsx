import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth';

const CustomerHeader = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const customerName = auth?.user?.name || "Customer";
    const handleLogout = () => {
        logout(
            () => {
                navigate("/login");
            }
        );
    };
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Welcome back,{customerName}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Customer Dashboard</h1>
                    <p className="text-muted-foreground mt-1">View booking history & statistics</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/customer/book")}
                    >
                        Book a Parcel
                    </button>
                    <button className="btn btn-primary cursor-pointer" onClick={handleLogout}>logout</button>
                </div>
            </div>
        </div>
    )
}

export default CustomerHeader