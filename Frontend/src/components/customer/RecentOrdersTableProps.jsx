import { ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./Card"


const ordersData = [
    {
        id: "ORD-2024-001",
        customer: "Sarah Johnson",
        date: "Jan 15, 2024",
        amount: "$245.00",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        items: 3,
    },
    {
        id: "ORD-2024-002",
        customer: "Michael Chen",
        date: "Jan 14, 2024",
        amount: "$189.50",
        status: "In Transit",
        statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        items: 2,
    },
    {
        id: "ORD-2024-003",
        customer: "Emma Wilson",
        date: "Jan 13, 2024",
        amount: "$512.75",
        status: "Processing",
        statusColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        items: 5,
    },
    {
        id: "ORD-2024-004",
        customer: "David Brown",
        date: "Jan 12, 2024",
        amount: "$98.20",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        items: 1,
    },
    {
        id: "ORD-2024-005",
        customer: "Lisa Anderson",
        date: "Jan 11, 2024",
        amount: "$334.60",
        status: "Pending",
        statusColor: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        items: 4,
    },
    {
        id: "ORD-2024-006",
        customer: "James Martinez",
        date: "Jan 10, 2024",
        amount: "$421.00",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        items: 3,
    },
    {
        id: "ORD-2024-007",
        customer: "Nicole Taylor",
        date: "Jan 09, 2024",
        amount: "$567.80",
        status: "Cancelled",
        statusColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        items: 2,
    },
    {
        id: "ORD-2024-008",
        customer: "Robert Garcia",
        date: "Jan 08, 2024",
        amount: "$276.45",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        items: 3,
    },
]

const itemsPerPage = 5

export function RecentOrdersTable({ currentPage, onPageChange }) {
    const totalPages = Math.ceil(ordersData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = ordersData.slice(startIndex, startIndex + itemsPerPage)

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">Recent Order History</CardTitle>
                <CardDescription>Your last {ordersData.length} orders</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Order ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Customer</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Items</th>
                                <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((order) => (
                                <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="py-4 px-4 text-sm font-medium text-foreground">{order.id}</td>
                                    <td className="py-4 px-4 text-sm text-foreground">{order.customer}</td>
                                    <td className="py-4 px-4 text-sm text-muted-foreground">{order.date}</td>
                                    <td className="py-4 px-4 text-sm font-semibold text-foreground">{order.amount}</td>
                                    <td className="py-4 px-4">
                                        <span>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-muted-foreground">{order.items}</td>
                                    <td className="py-4 px-4 text-center">
                                        <span>
                                            view
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
                        <span className="font-semibold text-foreground">
                            {Math.min(startIndex + itemsPerPage, ordersData.length)}
                        </span>{" "}
                        of <span className="font-semibold text-foreground">{ordersData.length}</span> results
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <div className="flex items-center gap-2 px-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className="w-10 h-10"
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
