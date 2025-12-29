import { ChevronRight, X } from "lucide-react";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AssignAgentModal from "./AssignAgentModal";

const statusConfig = {
    Delivered: { bg: "bg-green-100", text: "text-green-800" },
    "In Transit": { bg: "bg-blue-100", text: "text-blue-800" },
    Assigned: { bg: "bg-purple-100", text: "text-purple-800" },
    "Picked Up": { bg: "bg-indigo-100", text: "text-indigo-800" },
    Pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    Failed: { bg: "bg-red-100", text: "text-red-800" },
};

export default function DeliveriesTable() {
    const axiosPrivate = useAxiosPrivate();

    const [deliveries, setDeliveries] = useState([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 5 });
    const [loading, setLoading] = useState(false);

    // agents
    const [agents, setAgents] = useState([]);
    const [agentsLoading, setAgentsLoading] = useState(false);

    // modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [assigning, setAssigning] = useState(false);

    const fetchParcels = async (page = meta.page) => {
        try {
            setLoading(true);
            const res = await axiosPrivate.get("/parcels/all", {
                params: { page, limit: meta.limit },
            });
            console.log(res.data);

            setDeliveries(res.data?.data || []);
            setMeta((m) => ({ ...m, ...(res.data?.meta || {}), page }));
        } catch (err) {
            console.error("Bookings load failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            setAgentsLoading(true);
            const res = await axiosPrivate.get("/users/agents");
            setAgents(res.data?.data || []);
        } catch (err) {
            console.error("Agents load failed:", err);
        } finally {
            setAgentsLoading(false);
        }
    };

    useEffect(() => {
        fetchParcels(1);
    }, []);

    const openAssignModal = async (parcel) => {
        console.log("parcel", parcel);
        setSelectedParcel(parcel);
        setSelectedAgentId("");
        setIsModalOpen(true);


        if (agents.length === 0) {
            await fetchAgents();
        }
    };

    const closeModal = () => {
        if (assigning) return;
        setIsModalOpen(false);
        setSelectedParcel(null);
        setSelectedAgentId("");
    };

    const handleAssign = async () => {
        if (!selectedParcel?._id) return;
        if (!selectedAgentId) {
            alert("Please select an agent");
            return;
        }

        try {
            setAssigning(true);
            const assignRes = await axiosPrivate.patch(`/parcels/assign/${selectedParcel._id}`, {
                agentId: selectedAgentId,
            });
            console.log("assignRes-------------", assignRes);

            closeModal();

            const fetchParcelsRes = await fetchParcels(meta.page);
            console.log(fetchParcelsRes); //came undefined why
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to assign agent");
            console.error("Assign failed:", err);
        } finally {
            setAssigning(false);
        }
    };
    // export as pdf 
    const handleExportPdf = (rows) => {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("Deliveries Report", 14, 15);

        const tableBody = rows.map((p, idx) => [
            idx + 1,
            p.trackingId || String(p._id).slice(-6),
            p.sender?.name || "—",
            p.deliveryAgent?.name || "Unassigned",
            p.status || "Pending",
            String(p.paymentDetails?.amount ?? "—"),
        ]);

        autoTable(doc, {
            startY: 22,
            head: [["#", "Tracking ID", "Customer", "Agent", "Status", "Amount"]],
            body: tableBody,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [37, 99, 235] }, // blue header
        });

        doc.save("deliveries.pdf");
    };
    // export as excel
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(deliveries);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Deliveries");
        XLSX.writeFile(wb, "deliveries.xlsx");


    }

    const showingFrom = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const showingTo = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">View all Bookings</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleExportPdf(deliveries)} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Export PDF
                        </button>
                        <button onClick={handleExportExcel} className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Export Excel
                        </button>
                    </div>
                </div>
                {loading && <span className="text-sm text-gray-500">Loading...</span>}
                {!loading && (
                    <p className="text-sm text-gray-500">
                        Showing {showingFrom} to {showingTo} of {meta.total} parcels
                    </p>
                )}
            </div>


            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Tracking ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Agent
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {deliveries.map((p) => {
                            const status = p.status || "Pending";
                            const cfg = statusConfig[status] || statusConfig.Pending;
                            const assigned = !!p.deliveryAgent?._id;
                            const isAssigned = !!p.deliveryAgent?._id;
                            const locked = ["Picked Up", "In Transit", "Delivered"].includes(p.status);

                            return (
                                <tr key={p._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                                        {p.trackingId || String(p._id).slice(-6)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {p.sender?.name || "—"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {p.deliveryAgent?.name ? (
                                            <div>
                                                <div className="text-gray-900 font-medium">{p.deliveryAgent.name}</div>
                                                {p.assignedBy?.name && (
                                                    <div className="text-xs text-gray-500">
                                                        Assigned by {p.assignedBy.name}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            "Unassigned"
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                                            {status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        {p.paymentDetails?.amount ?? "—"}
                                    </td>

                                    <td className="px-6 py-4">
                                        {!isAssigned && !locked ? (
                                            <button
                                                onClick={() => openAssignModal(p)}
                                                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Assign
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500">—</span>
                                        )}
                                    </td>

                                </tr>
                            );
                        })}

                        {!loading && deliveries.length === 0 && (
                            <tr>
                                <td className="px-6 py-6 text-sm text-gray-500" colSpan={6}>
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                    {meta.total === 0 ? "Showing 0 results" : `Showing ${showingFrom}-${showingTo} of ${meta.total} bookings`}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={meta.page <= 1 || loading}
                        onClick={() => fetchParcels(meta.page - 1)}
                        className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <button
                        disabled={meta.page * meta.limit >= meta.total || loading}
                        onClick={() => fetchParcels(meta.page + 1)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>


            {isModalOpen && (
                <AssignAgentModal
                    open={isModalOpen}
                    onClose={closeModal}
                    parcel={selectedParcel}
                    agents={agents}
                    agentsLoading={agentsLoading}
                    assigning={assigning}
                    selectedAgentId={selectedAgentId}
                    onChangeAgent={setSelectedAgentId}
                    onConfirm={handleAssign}
                />
            )}
        </div>
    );
}
