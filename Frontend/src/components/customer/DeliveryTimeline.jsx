import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Info, MapPin, RefreshCw } from "lucide-react"
import { useState } from "react"

const timelineEvents = [
    {
        id: 1,
        status: "Order Confirmed",
        date: "Dec 25, 2024",
        time: "10:30 AM",
        description: "Your order has been confirmed and is being prepared",
        completed: true,
        icon: CheckCircle2,
    },

]

export function DeliveryTimeline() {
    const [selectedOrder, setSelectedOrder] = useState("ORD-2024-1547")

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Live Parcel Tracking
                        </CardTitle>
                        <CardDescription>Track your parcel in real-time</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedOrder}
                            onChange={(e) => setSelectedOrder(e.target.value)}
                            className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                        >
                            <option value="ORD-2024-1547">Order #ORD-2024-1547</option>
                            <option value="ORD-2024-1523">Order #ORD-2024-1523</option>
                            <option value="ORD-2024-1501">Order #ORD-2024-1501</option>
                        </select>
                        <button size="sm" variant="default">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 h-64 flex items-center justify-center border border-border relative">
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 400 300">
                            <rect width="400" height="300" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                            <circle cx="80" cy="100" r="5" fill="#ef4444" />
                            <circle cx="150" cy="120" r="5" fill="#ef4444" />
                            <circle cx="220" cy="140" r="5" fill="#ef4444" />
                            <circle cx="290" cy="160" r="5" fill="#ef4444" />
                            <path
                                d="M 80 100 Q 150 110 220 140 T 290 160"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                            />
                        </svg>
                    </div>
                    <div className="text-center relative z-10">
                        <MapPin className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">Active Route Tracking</p>
                        <p className="text-xs text-muted-foreground">Multiple delivery stops in progress</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Delivery Timeline</h3>
                    <div className="space-y-4">
                        {timelineEvents.map((event, index) => {
                            const Icon = event.icon
                            return (
                                <div key={event.id} className="flex gap-4">
                                    {/* Timeline dot and line */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${event.completed
                                                ? "bg-green-500 border-green-500"
                                                : event.active
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                                }`}
                                        >
                                            {event.completed || event.active ? (
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                            )}
                                        </div>
                                        {index !== timelineEvents.length - 1 && (
                                            <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 my-1" />
                                        )}
                                    </div>

                                    {/* Timeline content */}
                                    <div className="pb-4 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p
                                                    className={`font-semibold ${event.completed || event.active ? "text-foreground" : "text-muted-foreground"}`}
                                                >
                                                    {event.status}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {event.date}
                                                    {event.time && ` - ${event.time}`}
                                                </p>
                                            </div>
                                            {event.active && <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100">Delivery Instructions</p>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                Leave at front door if not home. Call before delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
