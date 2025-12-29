import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { CheckCircle2, Info, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";

const SOCKET_URL = "http://localhost:8000";

const STATUS_LABEL = {
    Pending: "Pending",
    Assigned: "Assigned",
    "Picked Up": "Picked Up",
    "In Transit": "In Transit",
    Delivered: "Delivered",
    Failed: "Failed",
    Cancelled: "Cancelled",
};

const STATUS_ORDER = ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered"];

function formatDateTime(d) {
    if (!d) return { date: "—", time: "" };
    const dt = new Date(d);
    const date = dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    const time = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    return { date, time };
}

function buildTimeline(parcel) {
    const history = Array.isArray(parcel?.statusHistory) ? parcel.statusHistory : [];
    const currentStatus = parcel?.status || "Pending";

    if (history.length > 0) {
        const last = history[history.length - 1]?.status || currentStatus;

        return history
            .slice()
            .sort((a, b) => new Date(a.at) - new Date(b.at))
            .map((h, idx) => {
                const { date, time } = formatDateTime(h.at);
                const isLast = idx === history.length - 1;

                return {
                    id: `${idx}-${h.status}-${h.at}`,
                    status: STATUS_LABEL[h.status] || h.status,
                    date,
                    time,
                    description: h.note || `Status updated to ${h.status}`,
                    completed: !isLast,
                    active: isLast,
                };
            });
    }

    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const upto = currentIndex === -1 ? 0 : currentIndex;

    return STATUS_ORDER.slice(0, upto + 1).map((s, idx, arr) => {
        const isLast = idx === arr.length - 1;
        return {
            id: `${idx}-${s}`,
            status: STATUS_LABEL[s] || s,
            date: "—",
            time: "",
            description: isLast ? `Current status: ${s}` : `Completed: ${s}`,
            completed: !isLast,
            active: isLast,
        };
    });
}

export function DeliveryTimeline() {
    const axiosPrivate = useAxiosPrivate();
    const socketRef = useRef(null);

    const [orders, setOrders] = useState([]);
    const [selectedParcelId, setSelectedParcelId] = useState("");
    const [parcel, setParcel] = useState(null);

    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingParcel, setLoadingParcel] = useState(false);

    const [liveLocation, setLiveLocation] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [liveHistory, setLiveHistory] = useState(null);

    const timelineEvents = useMemo(() => {
        if (!parcel) return [];
        const merged = {
            ...parcel,
            status: liveStatus || parcel.status,
            statusHistory: liveHistory || parcel.statusHistory,
            currentLocation: liveLocation || parcel.currentLocation,
        };
        return buildTimeline(merged);
    }, [parcel, liveStatus, liveHistory, liveLocation]);

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const res = await axiosPrivate.get("/parcels/my-orders", { params: { page: 1, limit: 50 } });
            const list = res.data?.data || [];
            setOrders(list);

            if (!selectedParcelId && list.length > 0) {
                setSelectedParcelId(list[0]._id);
            }
        } catch (e) {
            console.error("Orders load failed:", e);
        } finally {
            setLoadingOrders(false);
        }
    };

    const loadParcel = async (id) => {
        if (!id) return;
        try {
            setLoadingParcel(true);
            const res = await axiosPrivate.get(`/parcels/${id}`);
            const p = res.data?.data;
            setParcel(p);

            setLiveLocation(p?.currentLocation || null);
            setLiveStatus(null);
            setLiveHistory(null);
        } catch (e) {
            console.error("Parcel load failed:", e);
        } finally {
            setLoadingParcel(false);
        }
    };

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ["polling", "websocket"],
            path: "/socket.io",
        });
        socketRef.current = socket;

        socket.on("connect", () => {
        });

        socket.on("parcel:location", (payload) => {
            if (payload?.parcelId !== selectedParcelId) return;
            setLiveLocation(payload.currentLocation || null);
        });

        socket.on("parcel:status", (payload) => {
            if (payload?.parcelId !== selectedParcelId) return;
            if (payload.status) setLiveStatus(payload.status);
            if (payload.statusHistory) setLiveHistory(payload.statusHistory);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        loadOrders();

    }, []);


    useEffect(() => {
        if (!selectedParcelId) return;
        const socket = socketRef.current;
        if (socket) {
            socket.emit("parcel:join", { parcelId: selectedParcelId });
        }

        loadParcel(selectedParcelId);

        return () => {
            if (socket) socket.emit("parcel:leave", { parcelId: selectedParcelId });
        };

    }, [selectedParcelId]);

    const canShowLive =
        ["Assigned", "Picked Up", "In Transit"].includes(liveStatus || parcel?.status);

    const currentLoc = liveLocation || parcel?.currentLocation;

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Live Parcel Tracking
                        </CardTitle>
                        <CardDescription>Track your parcel in real-time</CardDescription>
                    </div>

                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedParcelId}
                            onChange={(e) => setSelectedParcelId(e.target.value)}
                            className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm"
                            disabled={loadingOrders || orders.length === 0}
                        >
                            {orders.length === 0 && <option value="">No orders</option>}
                            {orders.map((o) => (
                                <option key={o._id} value={o._id}>
                                    {o.trackingId ? `#${o.trackingId}` : `#${String(o._id).slice(-6)}`} — {o.status}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => loadParcel(selectedParcelId)}
                            className="px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center gap-2"
                            disabled={!selectedParcelId || loadingParcel}
                        >
                            <RefreshCw className={`w-4 h-4 ${loadingParcel ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">

                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 h-64 flex items-center justify-center border border-gray-200 relative">
                    <div className="text-center relative z-10 px-4">
                        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">
                            {parcel ? `Tracking: ${parcel.trackingId}` : "Select an order to track"}
                        </p>

                        {parcel && (
                            <p className="text-xs text-gray-600 mt-1">
                                Status: <span className="font-semibold">{liveStatus || parcel.status}</span>
                            </p>
                        )}

                        {parcel && canShowLive ? (
                            <p className="text-xs text-gray-600 mt-1">
                                Live Location:{" "}
                                <span className="font-semibold">
                                    {currentLoc?.lat?.toFixed?.(5) ?? "—"}, {currentLoc?.lng?.toFixed?.(5) ?? "—"}
                                </span>
                            </p>
                        ) : parcel ? (
                            <p className="text-xs text-gray-600 mt-1">
                                Live tracking starts after <span className="font-semibold">Assigned</span>.
                            </p>
                        ) : null}
                    </div>
                </div>


                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Delivery Timeline</h3>

                    {timelineEvents.length === 0 ? (
                        <p className="text-sm text-gray-500">No timeline yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {timelineEvents.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${event.completed
                                                ? "bg-green-500 border-green-500"
                                                : event.active
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "bg-white border-gray-300"
                                                }`}
                                        >
                                            {event.completed || event.active ? (
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                            )}
                                        </div>

                                        {index !== timelineEvents.length - 1 && (
                                            <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                        )}
                                    </div>

                                    <div className="pb-4 flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className={`font-semibold ${event.completed || event.active ? "text-gray-900" : "text-gray-500"}`}>
                                                    {event.status}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {event.date}
                                                    {event.time && ` - ${event.time}`}
                                                </p>
                                            </div>
                                            {event.active && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-900">Delivery Instructions</p>
                            <p className="text-sm text-blue-800 mt-1">
                                Leave at front door if not home. Call before delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
