import { Bell, Mail } from "lucide-react"

export default function Header() {
    return (
        <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
                {/* WELCOME TEXT */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, John</h1>
                    <p className="text-sm text-gray-500 mt-1">Here's what's happening with your courier service today.</p>
                </div>

                {/* HEADER ACTIONS */}
                <div className="flex items-center gap-4">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        📊 Export Report
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <Mail className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                        <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                        <div className="w-8 h-8 bg-blue-500 rounded-full text-white text-xs font-bold flex items-center justify-center cursor-pointer">
                            JA
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
