import { useEffect, useMemo, useState } from "react";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { ShoppingBasket } from 'lucide-react';

const STAGES = ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered"];

function buildStages(status) {
    const idx = Math.max(0, STAGES.indexOf(status));
    return STAGES.map((name, i) => ({
        name,
        completed: i <= idx,
    }));
}

function progressFromStatus(status) {
    const idx = STAGES.indexOf(status);
    if (idx < 0) return 0;
    return Math.round((idx / (STAGES.length - 1)) * 100);
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function OngoingOrders() {
    const axiosPrivate = useAxiosPrivate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosPrivate.get("/parcels/my-orders", {
                params: { activeOnly: "true", page: 1, limit: 10 },
            });
            console.log("My orders load failed:", res.data);

            setOrders(res.data?.data || []);
        } catch (err) {
            console.error("My orders load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // convert backend parcels -> UI orders
    const ongoingOrders = useMemo(() => {
        return orders.map((p) => {
            const status = p.status || "Pending";
            const progress = progressFromStatus(status);

            return {
                id: p.trackingId || String(p._id).slice(-6),
                product: p.parcelDetails?.type || "Parcel",
                status,
                deliveryDate: formatDate(p.updatedAt), // or your ETA field later
                progress,
                stages: buildStages(status),
                amount: p.paymentDetails?.amount,
            };
        });
    }, [orders]);

    return (
        <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl">Ongoing Orders</CardTitle>
                    <CardDescription>View all active shipments</CardDescription>
                </div>

                <button onClick={fetchOrders} className="text-sm text-blue-600 hover:underline">
                    Refresh
                </button>
            </CardHeader>

            <CardContent className="space-y-6">
                {loading && <p className="text-sm text-gray-500">Loading...</p>}

                {!loading && ongoingOrders.length === 0 && (
                    <p className="text-sm text-gray-500">No ongoing shipments.</p>
                )}

                {ongoingOrders.map((order) => (
                    <div key={order.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4 flex-1">
                                <ShoppingBasket className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{order.product}</h3>
                                    <p className="text-sm text-gray-500">{order.id}</p>
                                    <p className="text-xs text-gray-600 mt-1">Status: <span className="font-medium">{order.status}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="mb-3 flex justify-between items-center text-sm">
                            <span className="text-gray-500">Last Update</span>
                            <span className="font-medium text-gray-900">{order.deliveryDate}</span>
                        </div>

                        {/* Progress */}
                        <div className="mb-2 text-sm font-medium text-gray-900">{order.progress}%</div>

                        <div className="mb-4">
                            <div className="relative h-2 rounded-full bg-gray-200 overflow-hidden mb-3">
                                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${order.progress}%` }} />
                            </div>

                            {/* Stages */}
                            <div className="flex justify-between text-xs">
                                {order.stages.map((stage, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className={`w-3 h-3 rounded-full border-2 ${stage.completed
                                                ? "bg-green-500 border-green-500"
                                                : "border-gray-300 bg-white"
                                                }`}
                                        />
                                        <span className={stage.completed ? "text-green-600 font-medium" : "text-gray-500"}>
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
    );
}
