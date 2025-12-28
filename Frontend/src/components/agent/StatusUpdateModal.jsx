import { useMemo } from "react";
import { canMoveTo, normalizeStatus, STATUS_CONFIG, STATUS_ORDER } from "../../api/constants";

export default function StatusUpdateModal({ parcel, saving, onClose, onConfirm }) {
    const currentStatus = normalizeStatus(parcel.status);

    const nextOptions = useMemo(() => {
        if (currentStatus === "Delivered" || currentStatus === "Failed") return [];
        const ci = STATUS_ORDER.indexOf(currentStatus);
        const next = ci === -1 ? [] : [STATUS_ORDER[ci + 1]].filter(Boolean);
        return next;
    }, [currentStatus]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-2xl md:rounded-lg w-full md:max-w-sm max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Update Status</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none disabled:opacity-60"
                        disabled={saving}
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {nextOptions.map((status) => (
                        <button
                            key={status}
                            disabled={saving || !canMoveTo(currentStatus, status)}
                            onClick={() => onConfirm(parcel, status)}
                            className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-60"
                        >
                            <p className="font-medium text-sm text-gray-900">{STATUS_CONFIG[status]?.label || status}</p>
                            <p className="text-xs text-gray-600 mt-1">
                                Mark as {String(STATUS_CONFIG[status]?.label || status).toLowerCase()}
                            </p>
                        </button>
                    ))}

                    {currentStatus !== "Delivered" && currentStatus !== "Failed" && (
                        <button
                            disabled={saving}
                            onClick={() => onConfirm(parcel, "Failed")}
                            className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                            <p className="font-medium text-sm text-gray-900">Failed</p>
                            <p className="text-xs text-gray-600 mt-1">Mark delivery as failed</p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
