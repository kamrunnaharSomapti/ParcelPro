import { LayoutDashboard, Users, Truck, Package, CreditCard, Settings } from "lucide-react"
const menuItems = [
    { icon: LayoutDashboard, label: "Admin Dashboard", active: true },
    { icon: Users, label: "Customer Portal" },
    { icon: Truck, label: "Delivery Agents" },
    { icon: Package, label: "All Parcels" },
    { icon: Users, label: "Customers" },
    { icon: CreditCard, label: "Payments" },
    { icon: Settings, label: "Settings" },
]
export default function Sidebar() {
    return (
        <div className="w-48 bg-slate-900 text-white flex flex-col h-screen">
            {/* LOGO SECTION */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <Package className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">CourierPro</span>
                </div>
            </div>

            {/* NAVIGATION MENU */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${item.active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-slate-800 hover:text-white"
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* USER PROFILE SECTION */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">AU</div>
                    <div className="text-xs flex-1 min-w-0">
                        <p className="font-semibold truncate">Admin User</p>
                        <p className="text-gray-400 truncate">admin@courier.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}