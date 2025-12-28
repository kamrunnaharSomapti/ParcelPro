import { useState } from "react"
import { Package, Truck, Clock, AlertCircle } from "lucide-react"
import { StatCard } from "./StatCard"
import { useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { OngoingOrders } from "./OngoingOrders"
import { OrderStatsChart } from "./OrderStatsChart"
import { DeliveryTimeline } from "./DeliveryTimeline";
import { RecentOrdersTable } from "./RecentOrdersTableProps"


export function CustomerDashboard() {
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate();

    return (
        <div className="p-6 from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900  md:p-8">
            {/* Header */}
            <CustomerHeader />


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Package} label="Total Orders" value="1,245" subtext="20% increase" color="blue" />
                <StatCard icon={Truck} label="In Transit" value="42" subtext="5 on route" color="green" />
                <StatCard icon={Clock} label="Pending" value="8" subtext="2 delayed" color="orange" />
                <StatCard icon={AlertCircle} label="Issues" value="3" subtext="Needs attention" color="purple" />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Ongoing Orders */}
                <div className="lg:col-span-2">
                    <OngoingOrders />
                </div>

                {/* Order Stats Chart */}
                <OrderStatsChart />
            </div>

            {/* Delivery Timeline */}
            <div className="mb-8">
                <DeliveryTimeline />
            </div>

            {/* Recent Order History */}
            <RecentOrdersTable currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
    )
}
