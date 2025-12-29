import { useEffect, useState } from "react"
import { Package, Truck, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { StatCard } from "./StatCard"
import { useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { OngoingOrders } from "./OngoingOrders"
import { OrderStatsChart } from "./OrderStatsChart"
import { DeliveryTimeline } from "./DeliveryTimeline";
import { RecentOrdersTable } from "./RecentOrdersTableProps"
import { useAxiosPrivate } from "../../api/useAxiosPrivate"


export function CustomerDashboard() {
    const [currentPage, setCurrentPage] = useState(1)
    const axiosPrivate = useAxiosPrivate();
    const [metrics, setMetrics] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosPrivate.get("/parcels/customer-metrics", {
                    params: { range: "today" },
                });
                setMetrics(res.data?.data);
            } catch (e) {
                console.error("Customer metrics load failed:", e);
            }
        };
        load();
    }, [axiosPrivate]);
    const cards = [
        {
            icon: Package,
            label: "Total Bookings",
            value: metrics ? String(metrics.totalBookings) : "—",
            subtext: "today",
            color: "blue",
        },
        {
            icon: Truck,
            label: "Active Deliveries",
            value: metrics ? String(metrics.activeDeliveries) : "—",
            subtext: "running",
            color: "orange",
        },
        {
            icon: CheckCircle,
            label: "Delivered",
            value: metrics ? String(metrics.deliveredCount) : "—",
            subtext: "completed",
            color: "green",
        },
        {
            icon: XCircle,
            label: "Failed",
            value: metrics ? String(metrics.failedCount) : "—",
            subtext: "issues",
            color: "purple",
        },
    ];

    return (
        <div className="in-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <CustomerHeader />


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4  max-w-5xl mx-auto px-4 py-4 md:py-6">
                {cards.map((c) => (
                    <StatCard key={c.label} {...c} />
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-4 max-w-5xl mx-auto px-4 py-4 md:py-6">
                {/* Ongoing Orders */}
                <div className="">
                    <OngoingOrders />
                </div>

                {/* Order Stats Chart */}
                {/* <OrderStatsChart /> */}
            </div>

            {/* Delivery Timeline */}
            <div className="mb-4 max-w-5xl mx-auto px-4 py-4 md:py-6 bg-white">
                <DeliveryTimeline />
            </div>

            {/* Recent Order History */}
            <RecentOrdersTable currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
    )
}
