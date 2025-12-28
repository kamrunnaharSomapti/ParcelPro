import { ChevronRight } from "lucide-react"

const deliveries = [
    {
        id: "JCP-8204",
        customer: "Sarah Johnson",
        agent: "Mike Chan",
        recipient: "Mike Chan",
        status: "Delivered",
        amount: "$245.00",
    },
    {
        id: "JCP-8203",
        customer: "David Martinez",
        agent: "Alex Kumar",
        recipient: "Alex Kumar",
        status: "In Transit",
        amount: "$189.50",
    },
    {
        id: "JCP-8202",
        customer: "Emma Wilson",
        agent: "James Lee",
        recipient: "James Lee",
        status: "Pending",
        amount: "$312.75",
    },
    {
        id: "JCP-8201",
        customer: "Robert Brown",
        agent: "Mike Chan",
        recipient: "Mike Chan",
        status: "Failed",
        amount: "$156.00",
    },
    {
        id: "JCP-8200",
        customer: "Lisa Anderson",
        agent: "Alex Kumar",
        recipient: "Alex Kumar",
        status: "Delivered",
        amount: "$428.25",
    },
]

const statusConfig = {
    Delivered: { bg: "bg-green-100", text: "text-green-800" },
    "In Transit": { bg: "bg-blue-100", text: "text-blue-800" },
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    Failed: { bg: "bg-red-100", text: "text-red-800" },
}

export default function DeliveriesTable() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* TABLE HEADER */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Recent Deliveries</h2>
            </div>

            {/* TABLE CONTENT */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tracking ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Agent</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {deliveries.map((delivery) => (
                            <tr key={delivery.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-semibold text-blue-600">{delivery.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{delivery.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{delivery.agent}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[delivery.status].bg
                                            } ${statusConfig[delivery.status].text}`}
                                    >
                                        {delivery.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{delivery.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">Showing 5 of 47 deliveries</p>
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition">
                    View All <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
