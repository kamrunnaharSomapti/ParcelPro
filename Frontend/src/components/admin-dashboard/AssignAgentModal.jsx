import { X } from "lucide-react";

export default function AssignAgentModal({
    open,
    onClose,
    parcel,
    agents,
    agentsLoading,
    assigning,
    selectedAgentId,
    onChangeAgent,
    onConfirm,
}) {
    if (!open) return null;

    const bookingId = parcel?.trackingId || String(parcel?._id || "").slice(-6);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">Assign Agent</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={assigning}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                    <div className="text-sm text-gray-600">
                        Booking: <span className="font-semibold text-gray-900">{bookingId}</span>
                    </div>

                    <label className="text-sm font-medium text-gray-700">Select Agent</label>
                    <select
                        value={selectedAgentId}
                        onChange={(e) => onChangeAgent(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        disabled={agentsLoading || assigning}
                    >
                        <option value="">-- Select --</option>
                        {agents.map((a) => (
                            <option key={a._id} value={a._id}>
                                {a.name} {a.phone ? `(${a.phone})` : ""}
                            </option>
                        ))}
                    </select>

                    {agentsLoading && <p className="text-sm text-gray-500">Loading agents...</p>}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border bg-white"
                        disabled={assigning}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={assigning || agentsLoading || !selectedAgentId}
                    >
                        {assigning ? "Assigning..." : "Confirm Assign"}
                    </button>
                </div>
            </div>
        </div>
    );
}
