import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card"
// import Image from "next/image"

const ongoingOrders = [
    {
        id: "ORD-2024-1547",
        product: "Wireless Headphones Pro",
        // image: "/wireless-headphones.jpg",
        status: "In Transit",
        statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        deliveryDate: "Dec 30, 2024",
        progress: 75,
        stages: [
            { name: "Shipped", completed: true },
            { name: "In Transit", completed: true },
            { name: "Out for Delivery", completed: false },
            { name: "Delivered", completed: false },
        ],
    },


]



export function OngoingOrders() {
    return (
        <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl">Ongoing Orders</CardTitle>
                    <CardDescription>View all active shipments</CardDescription>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                    View All
                </a>
            </CardHeader>
            <CardContent className="space-y-6">
                {ongoingOrders.map((order) => (
                    <div key={order.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                        {/* Product Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4 flex-1">
                                <div className="relative w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                    {/* <Image src={order.image || "/placeholder.svg"} alt={order.product} fill className="object-cover" /> */}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">{order.product}</h3>
                                    <p className="text-sm text-muted-foreground">{order.id}</p>
                                    {/* <Badge variant="outline" className={`mt-2 ${order.statusColor}`}>
                                        {order.status}
                                    </Badge> */}
                                </div>
                            </div>
                            <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
                                Track
                            </a>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="mb-3 flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Estimated Delivery</span>
                            <span className="font-medium text-foreground">{order.deliveryDate}</span>
                        </div>

                        {/* Progress Percentage */}
                        <div className="mb-2 text-sm font-medium text-foreground">{order.progress}%</div>

                        <div className="mb-4">
                            <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{ width: `${order.progress}%` }}
                                />
                            </div>

                            {/* Stage indicators */}
                            <div className="flex justify-between text-xs">
                                {order.stages.map((stage, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className={`w-3 h-3 rounded-full border-2 ${stage.completed
                                                ? "bg-green-500 border-green-500"
                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                                }`}
                                        />
                                        <span
                                            className={
                                                stage.completed ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"
                                            }
                                        >
                                            {stage.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
