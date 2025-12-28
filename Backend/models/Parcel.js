const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        unique: true,
        required: true,
        default: () => `TRK-${Math.floor(100000 + Math.random() * 900000)}`
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    assignedAt: {
        type: Date,
        default: null,
    },
    parcelDetails: {
        weight: Number,
        type: { type: String, enum: ['Document', 'Electronics', 'Clothing', 'Fragile', 'Other'] },
        description: String
    },
    pickupLocation: {
        address: { type: String, required: true },
        lat: Number,
        lng: Number
    },
    deliveryLocation: {
        address: { type: String, required: true },
        lat: Number,
        lng: Number
    },

    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled', 'Failed'],
        default: 'Pending',
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: ['Pending', 'Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled', 'Failed'],
                required: true,
            },
            note: { type: String, default: "" },
            by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
            at: { type: Date, default: Date.now },
        },
    ],
    paymentDetails: {
        method: { type: String, enum: ['COD', 'PREPAID'], required: true },
        amount: { type: Number, required: true },
        isPaid: { type: Boolean, default: false }
    },
    qrCode: {
        type: String
    },
    currentLocation: {
        lat: Number,
        lng: Number,
        updatedAt: Date
    },

}, { timestamps: true });

module.exports = mongoose.model('Parcel', parcelSchema);