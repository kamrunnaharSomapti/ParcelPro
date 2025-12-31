import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { useLoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { CheckCircle2, Info, MapPin, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAxiosPrivate } from "../../api/useAxiosPrivate";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

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

const MAP_LIBRARIES = [];
const MAP_CONTAINER_STYLE = { width: "100%", height: "260px" };
const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 }; // Dhaka

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
        const sorted = history.slice().sort((a, b) => new Date(a.at) - new Date(b.at));
        return sorted.map((h, idx) => {
            const { date, time } = formatDateTime(h.at);
            const isLast = idx === sorted.length - 1;
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

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY?.trim();
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: MAP_LIBRARIES,
    });

    const socketRef = useRef(null);
    const mapRef = useRef(null);

    const selectedIdRef = useRef("");
    const lastJoinedRef = useRef("");

    const [orders, setOrders] = useState([]);
    const [selectedParcelId, setSelectedParcelId] = useState("");
    const [parcel, setParcel] = useState(null);

    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingParcel, setLoadingParcel] = useState(false);

    const [liveLocation, setLiveLocation] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [liveHistory, setLiveHistory] = useState(null);

    // keep selected id in ref (so socket callbacks always use latest id)
    useEffect(() => {
        selectedIdRef.current = selectedParcelId || "";
    }, [selectedParcelId]);

    const mergedParcel = useMemo(() => {
        if (!parcel) return null;
        return {
            ...parcel,
            status: liveStatus || parcel.status,
            statusHistory: liveHistory || parcel.statusHistory,
            currentLocation: liveLocation || parcel.currentLocation,
        };
    }, [parcel, liveStatus, liveHistory, liveLocation]);

    const timelineEvents = useMemo(() => {
        if (!mergedParcel) return [];
        return buildTimeline(mergedParcel);
    }, [mergedParcel]);

    const currentLoc = mergedParcel?.currentLocation || null;

    // ✅ SHOW agent marker whenever currentLocation exists (no status blocking)
    const agentMarker = useMemo(() => {
        if (currentLoc?.lat == null || currentLoc?.lng == null) return null;
        const lat = Number(currentLoc.lat);
        const lng = Number(currentLoc.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng };
    }, [currentLoc?.lat, currentLoc?.lng]);

    const pickupMarker = useMemo(() => {
        const p = mergedParcel?.pickupLocation;
        if (p?.lat == null || p?.lng == null) return null;
        const lat = Number(p.lat);
        const lng = Number(p.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng };
    }, [mergedParcel?.pickupLocation?.lat, mergedParcel?.pickupLocation?.lng]);

    const deliveryMarker = useMemo(() => {
        const d = mergedParcel?.deliveryLocation;
        if (d?.lat == null || d?.lng == null) return null;
        const lat = Number(d.lat);
        const lng = Number(d.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng };
    }, [mergedParcel?.deliveryLocation?.lat, mergedParcel?.deliveryLocation?.lng]);

    const mapCenter = useMemo(() => {
        return agentMarker || pickupMarker || deliveryMarker || DEFAULT_CENTER;
    }, [agentMarker, pickupMarker, deliveryMarker]);

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const res = await axiosPrivate.get("/parcels/my-orders", { params: { page: 1, limit: 50 } });
            const list = res.data?.data || [];
            setOrders(list);

            if (!selectedIdRef.current && list.length > 0) {
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
            const p = res.data?.data || null;
            setParcel(p);

            // refresh snapshot
            setLiveLocation(p?.currentLocation || null);
            setLiveStatus(null);
            setLiveHistory(null);
        } catch (e) {
            console.error("Parcel load failed:", e);
        } finally {
            setLoadingParcel(false);
        }
    };

    //  INIT SOCKET ONCE
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            path: "/socket.io",
            transports: ["polling", "websocket"],
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 10,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            const id = selectedIdRef.current;
            if (id) {
                socket.emit("parcel:join", { parcelId: id });
                lastJoinedRef.current = id;
            }
        });

        socket.on("connect_error", (e) => console.log("❌ Customer connect_error:", e.message));
        socket.on("disconnect", (r) => console.log("⚠️ Customer disconnected:", r));

        // Debug: show ANY server event name (very useful)
        socket.onAny((event, payload) => {
            // comment this if too noisy
            // console.log("📡 SOCKET EVENT:", event, payload);
        });

        const handleLoc = (payload) => {
            const id = selectedIdRef.current;
            if (!id) return;

            const parcelId = payload?.parcelId;
            if (parcelId !== id) return;

            const loc =
                payload?.currentLocation ||
                payload?.location ||
                (payload?.lat != null && payload?.lng != null ? { lat: payload.lat, lng: payload.lng } : null);

            if (loc) {
                setLiveLocation(loc);
            }
        };

        // listen for any possible location event names
        socket.on("parcel:location", handleLoc);
        socket.on("parcel:location:updated", handleLoc);
        socket.on("agent:location:update", handleLoc);

        socket.on("parcel:status", (payload) => {
            const id = selectedIdRef.current;
            if (!id) return;
            if (payload?.parcelId !== id) return;
            if (payload.status) setLiveStatus(payload.status);
            if (payload.statusHistory) setLiveHistory(payload.statusHistory);
        });

        return () => {
            try {
                const last = lastJoinedRef.current;
                if (last) socket.emit("parcel:leave", { parcelId: last });
            } catch { }
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    // load orders once
    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //  when selected changes: leave old + join new + fetch snapshot
    useEffect(() => {
        const socket = socketRef.current;
        const nextId = selectedParcelId;
        if (!nextId) return;

        if (socket && lastJoinedRef.current && lastJoinedRef.current !== nextId) {
            socket.emit("parcel:leave", { parcelId: lastJoinedRef.current });
        }

        if (socket) {
            socket.emit("parcel:join", { parcelId: nextId });
            lastJoinedRef.current = nextId;
        }

        loadParcel(nextId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedParcelId]);


    useEffect(() => {
        if (!selectedParcelId) return;

        const t = setInterval(() => {
            loadParcel(selectedParcelId);
        }, 2000);

        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedParcelId]);


    useEffect(() => {
        if (agentMarker && mapRef.current) {
            mapRef.current.panTo(agentMarker);
        }
    }, [agentMarker]);

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
                {/* Map */}
                <div className="rounded-lg overflow-hidden border border-gray-200">
                    {isLoaded ? (
                        <GoogleMap
                            onLoad={(map) => (mapRef.current = map)}
                            mapContainerStyle={MAP_CONTAINER_STYLE}
                            center={mapCenter}
                            zoom={13}
                            key={selectedParcelId || "map"}
                        >
                            {pickupMarker && <Marker position={pickupMarker} label="P" />}
                            {deliveryMarker && <Marker position={deliveryMarker} label="D" />}
                            {agentMarker && <Marker position={agentMarker} label="A" />}

                            {agentMarker && deliveryMarker && <Polyline path={[agentMarker, deliveryMarker]} />}
                        </GoogleMap>
                    ) : (
                        <div className="h-[260px] flex items-center justify-center text-sm text-gray-500">
                            Loading map...
                        </div>
                    )}
                </div>

                {/* Timeline */}
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

                                        {index !== timelineEvents.length - 1 && <div className="w-0.5 h-12 bg-gray-200 my-1" />}
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

                {/* Info */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-900">Delivery Instructions</p>
                            <p className="text-sm text-blue-800 mt-1">
                                {mergedParcel ? "Tracking updates every 2 seconds (and live socket if available)." : "Select an order to track."}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

