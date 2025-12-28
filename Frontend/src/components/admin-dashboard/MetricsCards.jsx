import { TrendingUp, TrendingDown } from "lucide-react"
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

export default function MetricsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                    {/* METRIC HEADER WITH ICON AND TREND */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-2xl">{metric.icon}</div>
                        <div className={`flex items-center gap-1 ${metric.trend > 0 ? "text-green-600" : "text-red-600"}`}>
                            {metric.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm font-semibold">{Math.abs(metric.trend)}%</span>
                        </div>
                    </div>

                    {/* METRIC TITLE */}
                    <h3 className="text-gray-600 text-sm font-medium mb-2">{metric.title}</h3>

                    {/* METRIC VALUE */}
                    <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>

                    {/* METRIC CHANGE */}
                    <p className="text-xs text-gray-500">
                        {metric.trend > 0 ? "+" : ""}
                        {metric.trend} from yesterday
                    </p>
                </div>
            ))}
        </div>
    )
}
