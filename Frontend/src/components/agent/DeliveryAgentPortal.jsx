import { useState } from "react"
import { MapPin, Package, Clock, Phone, Navigation } from "lucide-react"

// Dummy data for assigned parcels
const DUMMY_PARCELS = [
    {
        id: "PKG-001",
        recipient: "John Anderson",
        address: "123 Main St, New York, NY 10001",
        phone: "+1 (555) 123-4567",
        status: "pending",
        package_size: "Medium",
        weight: "2.5 kg",
        scheduled_time: "10:00 AM - 12:00 PM",
        location: { lat: 40.7128, lng: -74.006 },
    },
    {
        id: "PKG-002",
        recipient: "Sarah Mitchell",
        address: "456 Oak Ave, New York, NY 10002",
        phone: "+1 (555) 234-5678",
        status: "picked_up",
        package_size: "Small",
        weight: "0.8 kg",
        scheduled_time: "10:30 AM - 11:30 AM",
        location: { lat: 40.715, lng: -74.01 },
    },
    {
        id: "PKG-003",
        recipient: "Michael Chen",
        address: "789 Pine Rd, New York, NY 10003",
        phone: "+1 (555) 345-6789",
        status: "in_transit",
        package_size: "Large",
        weight: "5.2 kg",
        scheduled_time: "11:00 AM - 1:00 PM",
        location: { lat: 40.72, lng: -74.005 },
    },
    {
        id: "PKG-004",
        recipient: "Emily Rodriguez",
        address: "321 Elm St, New York, NY 10004",
        phone: "+1 (555) 456-7890",
        status: "in_transit",
        package_size: "Medium",
        weight: "1.9 kg",
        scheduled_time: "1:00 PM - 3:00 PM",
        location: { lat: 40.71, lng: -74.015 },
    },
    {
        id: "PKG-005",
        recipient: "David Thompson",
        address: "654 Maple Dr, New York, NY 10005",
        phone: "+1 (555) 567-8901",
        status: "delivered",
        package_size: "Small",
        weight: "0.5 kg",
        scheduled_time: "9:00 AM - 10:00 AM",
        location: { lat: 40.708, lng: -74.012 },
    },
    {
        id: "PKG-006",
        recipient: "Lisa Johnson",
        address: "987 Cedar Ln, New York, NY 10006",
        phone: "+1 (555) 678-9012",
        status: "failed",
        package_size: "Large",
        weight: "4.1 kg",
        scheduled_time: "3:00 PM - 5:00 PM",
        location: { lat: 40.717, lng: -74.008 },
    },
]

// Status colors and icons mapping
const STATUS_CONFIG = {
    pending: { bg: "bg-yellow-50", border: "border-yellow-200", color: "text-yellow-700", label: "Pending" },
    picked_up: { bg: "bg-blue-50", border: "border-blue-200", color: "text-blue-700", label: "Picked Up" },
    in_transit: { bg: "bg-purple-50", border: "border-purple-200", color: "text-purple-700", label: "In Transit" },
    delivered: { bg: "bg-green-50", border: "border-green-200", color: "text-green-700", label: "Delivered" },
    failed: { bg: "bg-red-50", border: "border-red-200", color: "text-red-700", label: "Failed" },
}

const STATUS_ORDER = ["pending", "picked_up", "in_transit", "delivered"]

// PARCEL CARD COMPONENT - displays individual parcel information
function ParcelCard({ parcel, onStatusUpdate, onViewRoute }) {
    const config = STATUS_CONFIG[parcel.status]
    const canUpdate = STATUS_ORDER.includes(parcel.status)

    return (
        <div className={`border-l-4 ${config.border} ${config.bg} p-4 rounded-lg space-y-3 mb-4`}>
            {/* PARCEL HEADER - ID and status badge */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{parcel.id}</p>
                    <p className={`text-xs ${config.color} font-medium mt-1`}>{config.label}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
                    {parcel.package_size}
                </span>
            </div>

            {/* RECIPIENT INFORMATION - name and address */}
            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">{parcel.recipient}</p>
                        <p className="text-xs text-gray-600 break-words">{parcel.address}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                    <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <a href={`tel:${parcel.phone}`} className="text-xs text-blue-600 hover:underline">
                        {parcel.phone}
                    </a>
                </div>
            </div>

            {/* PACKAGE DETAILS - size, weight, time window */}
            <div className="flex flex-wrap gap-2 ml-6 text-xs text-gray-600">
                <span>Weight: {parcel.weight}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {parcel.scheduled_time}
                </span>
            </div>

            {/* ACTION BUTTONS - update status and view route */}
            <div className="flex gap-2 mt-4 flex-wrap">
                {canUpdate && (
                    <button
                        onClick={() => onStatusUpdate(parcel.id)}
                        className="flex-1 min-w-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                    >
                        Update Status
                    </button>
                )}
                <button
                    onClick={() => onViewRoute(parcel.id)}
                    className="flex-1 min-w-0 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
                >
                    <Navigation className="w-3 h-3" />
                    Route
                </button>
            </div>
        </div>
    )
}

// STATUS UPDATE MODAL COMPONENT - allows updating parcel status
function StatusUpdateModal({ parcel, onClose, onConfirm }) {
    const currentStatus = parcel.status
    const currentIndex = STATUS_ORDER.indexOf(currentStatus)
    const nextStatuses = STATUS_ORDER.slice(currentIndex + 1)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-2xl md:rounded-lg w-full md:max-w-sm max-h-96 overflow-y-auto">
                {/* MODAL HEADER */}
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Update Status</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                        ×
                    </button>
                </div>

                {/* STATUS OPTIONS */}
                <div className="p-4 space-y-2">
                    {nextStatuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => onConfirm(parcel.id, status)}
                            className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <p className="font-medium text-sm text-gray-900">{STATUS_CONFIG[status].label}</p>
                            <p className="text-xs text-gray-600 mt-1">Mark as {STATUS_CONFIG[status].label.toLowerCase()}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ROUTE OPTIMIZATION MODAL COMPONENT - shows optimized delivery route
function RouteModal({ parcel, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-2xl md:rounded-lg w-full md:max-w-sm max-h-96 overflow-y-auto">
                {/* MODAL HEADER */}
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Optimized Route</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                        ×
                    </button>
                </div>

                {/* ROUTE INFO */}
                <div className="p-4 space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Google Maps would load here
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-semibold text-blue-900">ESTIMATED DISTANCE</p>
                            <p className="text-lg font-bold text-blue-600 mt-1">3.2 km</p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-semibold text-green-900">ESTIMATED TIME</p>
                            <p className="text-lg font-bold text-green-600 mt-1">12 minutes</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors text-sm"
                        >
                            Open in Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// MAIN DELIVERY AGENT PORTAL COMPONENT
export default function DeliveryAgentPortal() {
    const [activeTab, setActiveTab] = useState("all")
    const [parcels, setParcels] = useState(DUMMY_PARCELS)
    const [selectedParcel, setSelectedParcel] = useState(null)
    const [modalType, setModalType] = useState(null)

    // Filter parcels based on active tab
    const filteredParcels = activeTab === "all" ? parcels : parcels.filter((p) => p.status === activeTab)

    // Handle status update
    const handleStatusUpdate = (parcelId) => {
        const parcel = parcels.find((p) => p.id === parcelId)
        setSelectedParcel(parcel)
        setModalType("status")
    }

    // Confirm status update and update parcel
    const handleConfirmStatus = (parcelId, newStatus) => {
        setParcels(parcels.map((p) => (p.id === parcelId ? { ...p, status: newStatus } : p)))
        setModalType(null)
        setSelectedParcel(null)
    }

    // Handle route view
    const handleViewRoute = (parcelId) => {
        const parcel = parcels.find((p) => p.id === parcelId)
        setSelectedParcel(parcel)
        setModalType("route")
    }

    // Count parcels by status
    const counts = {
        all: parcels.length,
        pending: parcels.filter((p) => p.status === "pending").length,
        picked_up: parcels.filter((p) => p.status === "picked_up").length,
        in_transit: parcels.filter((p) => p.status === "in_transit").length,
        delivered: parcels.filter((p) => p.status === "delivered").length,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* HEADER SECTION - Agent info and search */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-40">
                <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">AA</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg md:text-xl font-bold">Alex Anderson</h1>
                            <p className="text-xs md:text-sm text-blue-100">Delivery Agent ID: AG-2024-001</p>
                        </div>
                        <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
                            <span className="text-xl">⊙</span>
                        </button>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search parcels..."
                            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-100 focus:outline-none focus:bg-opacity-30 transition-all text-sm"
                        />
                        <span className="absolute right-3 top-2.5 text-blue-100">🔍</span>
                    </div>
                </div>

                {/* STATUS SUMMARY CARDS */}
                <div className="max-w-2xl mx-auto px-4 pb-4 grid grid-cols-4 gap-2">
                    <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts.pending}</p>
                        <p className="text-xs text-blue-100 mt-1">Pending</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts.picked_up}</p>
                        <p className="text-xs text-blue-100 mt-1">Picked Up</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts.in_transit}</p>
                        <p className="text-xs text-blue-100 mt-1">In Transit</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold">{counts.delivered}</p>
                        <p className="text-xs text-blue-100 mt-1">Delivered</p>
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION - Filter parcels by status */}
            <div className="max-w-2xl mx-auto px-4 mt-4 sticky top-20 z-30 bg-gradient-to-br from-blue-50 to-indigo-100 pb-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: "all", label: "All" },
                        { id: "pending", label: "Pending" },
                        { id: "picked_up", label: "Picked Up" },
                        { id: "in_transit", label: "In Transit" },
                        { id: "delivered", label: "Delivered" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* PARCELS LIST - Main content area */}
            <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {filteredParcels.length > 0 ? (
                    <div>
                        {filteredParcels.map((parcel) => (
                            <ParcelCard
                                key={parcel.id}
                                parcel={parcel}
                                onStatusUpdate={handleStatusUpdate}
                                onViewRoute={handleViewRoute}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No parcels found</p>
                        <p className="text-sm text-gray-500 mt-1">Try a different filter</p>
                    </div>
                )}
            </div>

            {/* BOTTOM NAVIGATION - Quick actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 max-w-2xl mx-auto flex gap-2 justify-center">
                <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors text-sm">
                    📍 Nearby
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors text-sm">
                    📊 Stats
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors text-sm">
                    ⚙️ Settings
                </button>
            </div>

            {/* MODALS - Status update and route view */}
            {modalType === "status" && selectedParcel && (
                <StatusUpdateModal parcel={selectedParcel} onClose={() => setModalType(null)} onConfirm={handleConfirmStatus} />
            )}

            {modalType === "route" && selectedParcel && (
                <RouteModal parcel={selectedParcel} onClose={() => setModalType(null)} />
            )}
        </div>
    )
}
