import { Card, CardContent, CardHeader, CardTitle } from "./Card"
// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

const data = [
    { name: "Delivered", value: 45, color: "#10b981" },
    { name: "In Transit", value: 30, color: "#3b82f6" },
    { name: "Processing", value: 15, color: "#f59e0b" },
    { name: "Pending", value: 10, color: "#8b5cf6" },
]

export function OrderStatsChart() {
    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                {/* <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.5rem",
                            }}
                        />
                        <Legend verticalAlign="bottom" height={36} formatter={(value, entry) => entry.payload?.name} />
                    </PieChart>
                </ResponsiveContainer> */}
            </CardContent>
        </Card>
    )
}
