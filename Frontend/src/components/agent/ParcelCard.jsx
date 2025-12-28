import { Clock, Navigation, Package, Phone } from "lucide-react";
import { normalizeStatus, STATUS_CONFIG } from "../../api/constants";

export default function ParcelCard({ parcel, onStatusUpdate, onViewRoute }) {
    const status = normalizeStatus(parcel.status);
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

    const deliveryAddress = parcel.deliveryLocation?.address || "—";
    const pickupAddress = parcel.pickupLocation?.address || "—";

    const recipientName = parcel.sender?.name || "Customer";
    const phone = parcel.sender?.phone || "";

    return (
        <div className={`border-l-4 ${config.border} ${config.bg} p-4 rounded-lg space-y-3 mb-4`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                        {parcel.trackingId || String(parcel._id).slice(-6)}
                    </p>

                    <p className={`text-xs ${config.color} font-medium mt-1`}>{config.label}</p>

                    {parcel.assignedBy?.name && (
                        <p className="text-xs text-gray-500 mt-1">Assigned by {parcel.assignedBy.name}</p>
                    )}
                </div>

                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
                    {parcel.parcelDetails?.type || "Parcel"}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">{recipientName}</p>
                        <p className="text-xs text-gray-600 break-words">
                            <span className="font-semibold">Delivery:</span> {deliveryAddress}
                        </p>
                        <p className="text-xs text-gray-600 break-words mt-1">
                            <span className="font-semibold">Pickup:</span> {pickupAddress}
                        </p>
                    </div>
                </div>

                {phone && (
                    <div className="flex items-center gap-2 ml-6">
                        <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <a href={`tel:${phone}`} className="text-xs text-blue-600 hover:underline">
                            {phone}
                        </a>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 ml-6 text-xs text-gray-600">
                <span>Weight: {parcel.parcelDetails?.weight ?? "—"} kg</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(parcel.createdAt).toLocaleString()}
                </span>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
                {status !== "Delivered" && status !== "Failed" && (
                    <button
                        onClick={() => onStatusUpdate(parcel)}
                        className="flex-1 min-w-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                    >
                        Update Status
                    </button>
                )}

                <button
                    onClick={() => onViewRoute(parcel)}
                    className="flex-1 min-w-0 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
                >
                    <Navigation className="w-3 h-3" />
                    Route
                </button>
            </div>
        </div>
    );
}
