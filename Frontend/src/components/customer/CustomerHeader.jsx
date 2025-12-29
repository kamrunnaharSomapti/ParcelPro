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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-40">
            <div className='max-w-5xl mx-auto px-4 py-4 md:py-6'>
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className='flex flex-col gap-3'>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold text-blue-600">
                                    {customerName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-lg font-semibold text-white">Welcome back, {customerName}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Customer Dashboard</h1>
                            <p className="text-white mt-1">View booking history & statistics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-colors"
                            onClick={() => navigate("/customer/book")}
                        >
                            Book a Parcel
                        </button>
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-colors cursor-pointer" onClick={handleLogout}>logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerHeader