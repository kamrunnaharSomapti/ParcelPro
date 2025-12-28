import { Card, CardContent } from "./Card"
const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
}

export function StatCard({ icon: Icon, label, value, subtext, color }) {
    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">↑ {subtext}</span>
                </div>
                <h3 className="text-sm text-muted-foreground font-medium mb-1">{label}</h3>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
        </Card>
    )
}
