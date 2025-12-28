import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useMemo, useState } from "react";
import { useAxiosPrivate } from "../../api/useAxiosPrivate"
const metrics = [
    {
        title: "Total Deliveries",
        value: "1,247",
        trend: 12,
        icon: "📦",
        color: "blue",
    },
    {
        title: "Failed Deliveries",
        value: "23",
        trend: -5,
        icon: "❌",
        color: "red",
    },
    {
        title: "Active Deliveries",
        value: "554,892",
        trend: 8,
        icon: "🚚",
        color: "green",
    },
    {
        title: "Active Agents",
        value: "87",
        trend: 4,
        icon: "👥",
        color: "purple",
    },
]

export default function MetricsCards({ range }) {
    const axiosPrivate = useAxiosPrivate();
    const [metrics, setMetrics] = useState([
        { title: "Daily Bookings", value: "—", trend: 0, icon: "📅" },
        { title: "Failed Deliveries", value: "—", trend: 0, icon: "❌" },
        { title: "COD Amount", value: "—", trend: 0, icon: "💰" },
        { title: "Active Deliveries", value: "—", trend: 0, icon: "🚚" },
        { title: "Active Agents", value: "—", trend: 0, icon: "👥" },
        { title: "Active Customers", value: "—", trend: 0, icon: "🧑‍💼" },
    ]);
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosPrivate.get("/parcels/admin-metrics", {
                    params: { range }
                });

                const data = res.data?.data;

                setMetrics([
                    { title: "Daily Bookings", value: String(data.dailyBookings), trend: 0, icon: "📅" },
                    { title: "Failed Deliveries", value: String(data.failedDeliveries), trend: 0, icon: "❌" },
                    { title: "COD Amount", value: new Intl.NumberFormat("en-BD").format(data.codAmount), trend: 0, icon: "💰" },
                    { title: "Active Deliveries", value: String(data.activeDeliveries), trend: 0, icon: "🚚" },
                    { title: "Active Agents", value: String(data.activeAgents), trend: 0, icon: "👥" },
                    { title: "Active Customers", value: String(data.activeCustomers), trend: 0, icon: "🧑‍💼" },
                ]);
            } catch (err) {
                console.error("Metrics load failed:", err);
            }
        };

        load();
    }, [axiosPrivate, range]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">

                    <div className="flex items-start justify-between mb-4">
                        <div className="text-2xl">{metric.icon}</div>
                        <div className={`flex items-center gap-1 ${metric.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                            {metric.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm font-semibold">{Math.abs(metric.trend)}%</span>
                        </div>
                    </div>


                    <h3 className="text-gray-600 text-sm font-medium mb-2">{metric.title}</h3>


                    <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>


                    <p className="text-xs text-gray-500">
                        {metric.trend > 0 ? "+" : ""}
                        {metric.trend} from yesterday
                    </p>
                </div>
            ))}
        </div>
    )
}
