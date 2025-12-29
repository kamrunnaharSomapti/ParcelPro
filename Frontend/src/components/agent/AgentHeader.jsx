import React from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AgentHeader = ({ loading,
    onRefresh,
    q,
    setQ,
    counts, }) => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout(
            () => {
                navigate("/login");
            }
        );
    };
    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-40">
            <div className="max-w-3xl mx-auto px-4 py-4 md:py-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">AG</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg md:text-xl font-bold">Delivery Agent</h1>
                            <p className="text-xs md:text-sm text-blue-100">Assigned Parcels</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? "Refreshing..." : "Refresh"}
                        </button>
                        <button onClick={handleLogout} className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium disabled:opacity-60">Logout</button>
                    </div>
                </div>

                {/* <div className="relative">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        type="text"
                        placeholder="Search parcels..."
                        className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-100 focus:outline-none focus:bg-opacity-30 transition-all text-sm"
                    />
                    <span className="absolute right-3 top-2.5 text-blue-100">🔍</span>
                </div> */}

                <div className="mt-4 grid grid-cols-4 gap-2">
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts.Assigned || 0}</p>
                        <p className="text-xs text-blue-100 mt-1">Assigned</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts["Picked Up"] || 0}</p>
                        <p className="text-xs text-blue-100 mt-1">Picked Up</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts["In Transit"] || 0}</p>
                        <p className="text-xs text-blue-100 mt-1">In Transit</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts.Delivered || 0}</p>
                        <p className="text-xs text-blue-100 mt-1">Delivered</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgentHeader