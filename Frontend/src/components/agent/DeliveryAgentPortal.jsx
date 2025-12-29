import { useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import AgentHeader from "./AgentHeader";
import StatusTabs from "./StatusTabs";
import ParcelCard from "./ParcelCard";
import StatusUpdateModal from "./StatusUpdateModal";
import { normalizeStatus } from "../../api/constants";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";
import { ManualLocationTest } from "./ManualLocationTest";

export default function DeliveryAgentPortal() {
    const axiosPrivate = useAxiosPrivate();

    const [activeTab, setActiveTab] = useState("all");
    const [parcels, setParcels] = useState([]);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [q, setQ] = useState("");

    const loadMyTasks = async () => {
        try {
            setLoading(true);
            const res = await axiosPrivate.get("/parcels/my-tasks");
            setParcels(res.data?.data || []);
        } catch (err) {
            console.error("Failed to load my tasks:", err);
            alert(err?.response?.data?.message || "Failed to load assigned parcels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const counts = useMemo(() => {
        const c = { all: parcels.length };
        for (const p of parcels) {
            const s = normalizeStatus(p.status);
            c[s] = (c[s] || 0) + 1;
        }
        return c;
    }, [parcels]);

    const filteredParcels = useMemo(() => {
        let list = parcels;

        if (activeTab !== "all") {
            list = list.filter((p) => normalizeStatus(p.status) === activeTab);
        }

        if (q.trim()) {
            const s = q.trim().toLowerCase();
            list = list.filter((p) => {
                const t = (p.trackingId || "").toLowerCase();
                const del = (p.deliveryLocation?.address || "").toLowerCase();
                const pick = (p.pickupLocation?.address || "").toLowerCase();
                const name = (p.sender?.name || "").toLowerCase();
                return t.includes(s) || del.includes(s) || pick.includes(s) || name.includes(s);
            });
        }

        return list;
    }, [parcels, activeTab, q]);

    const openStatusModal = (parcel) => {
        setSelectedParcel(parcel);
        setModalType("status");
    };

    const closeModal = () => {
        if (saving) return;
        setModalType(null);
        setSelectedParcel(null);
    };

    const confirmStatus = async (parcel, newStatus) => {
        if (!parcel?._id) return;

        try {
            setSaving(true);

            const res = await axiosPrivate.patch(`/parcels/update-status/${parcel._id}`, {
                status: newStatus,
            });

            const updated = res.data?.data;
            setParcels((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

            closeModal();
        } catch (err) {
            console.error("Status update failed:", err);
            alert(err?.response?.data?.message || "Failed to update status");
        } finally {
            setSaving(false);
        }
    };

    const openRoute = (parcel) => {
        const pickup = parcel.pickupLocation?.address;
        const drop = parcel.deliveryLocation?.address;

        const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
            pickup || ""
        )}&destination=${encodeURIComponent(drop || "")}&travelmode=driving`;

        window.open(url, "_blank");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <AgentHeader loading={loading} onRefresh={loadMyTasks} q={q} setQ={setQ} counts={counts} />

            <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

            <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading...</div>
                ) : filteredParcels.length > 0 ? (
                    filteredParcels.map((parcel) => (
                        <div key={parcel._id} className="mb-4">
                            <ParcelCard
                                parcel={parcel}
                                onStatusUpdate={openStatusModal}
                                onViewRoute={openRoute}
                            />

                            {/* Manual test for THIS parcel */}
                            <ManualLocationTest parcelId={parcel._id} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No parcels found</p>
                        <p className="text-sm text-gray-500 mt-1">Try a different filter / search</p>
                    </div>
                )}
            </div>

            {modalType === "status" && selectedParcel && (
                <StatusUpdateModal
                    parcel={selectedParcel}
                    saving={saving}
                    onClose={closeModal}
                    onConfirm={confirmStatus}
                />
            )}

        </div>
    );
}
