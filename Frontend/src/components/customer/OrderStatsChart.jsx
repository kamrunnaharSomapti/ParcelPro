import { Card, CardContent, CardHeader, CardTitle } from "./Card"


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
        </Card>
    )
}
