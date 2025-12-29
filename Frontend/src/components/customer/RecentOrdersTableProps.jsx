import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./Card";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";

const itemsPerPageDefault = 5;

function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function RecentOrdersTable({ currentPage, onPageChange }) {
    const axiosPrivate = useAxiosPrivate();

    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: itemsPerPageDefault });
    const [loading, setLoading] = useState(false);

    const fetchOrders = async (page = currentPage) => {
        try {
            setLoading(true);
            const res = await axiosPrivate.get("/parcels/my-orders", {
                params: { page, limit: meta.limit }, // add status/search later if you want
            });

            setRows(res.data?.data || []);
            setMeta((m) => ({ ...m, ...(res.data?.meta || {}), page }));
        } catch (err) {
            console.error("Recent orders load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
    const startIndex = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const endIndex = Math.min(meta.page * meta.limit, meta.total);

    const tableData = useMemo(() => {
        return rows.map((p) => ({
            id: p.trackingId || String(p._id).slice(-6),
            customer: p.sender?.name || "You",
            date: formatDate(p.createdAt),
            amount: p.paymentDetails?.amount ?? "—",
            status: p.status || "Pending",
            items: 1,
            raw: p,
        }));
    }, [rows]);

    return (
        <Card className="border-0 shadow-sm bg-white ">
            <CardHeader>
                <CardTitle className="text-xl">Recent Order History</CardTitle>
                <CardDescription>
                    {loading ? "Loading..." : `Your last ${meta.total} orders`}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500">Tracking ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500">Status</th>
                                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-500">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading && tableData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-6 px-4 text-sm text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}

                            {tableData.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{order.date}</td>
                                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{order.status}</td>
                                    <td className="py-4 px-4 text-center">
                                        <button className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <Eye className="w-4 h-4" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{startIndex}</span> to{" "}
                        <span className="font-semibold text-gray-900">{endIndex}</span> of{" "}
                        <span className="font-semibold text-gray-900">{meta.total}</span>
                    </span>

                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages || loading}
                            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
