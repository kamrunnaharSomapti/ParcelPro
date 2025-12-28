import { Bell, Mail } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function Header({ range, onRangeChange }) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const adminName = auth?.user?.name || "Admin"
    const handleLogout = () => {
        logout(
            () => {
                navigate("/login");
            }
        );
    };
    return (
        <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {adminName}</h1>
                    <p className="text-sm text-gray-500 mt-1">Here's what's happening with your courier service today.</p>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={range}
                        onChange={(e) => onRangeChange(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <Mail className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                        <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                        <div className="ring-1 ring-gray-200 w-8 h-8 bg-blue-500 rounded-full text-white text-xs font-bold flex items-center justify-center cursor-pointer">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <button onClick={handleLogout} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
