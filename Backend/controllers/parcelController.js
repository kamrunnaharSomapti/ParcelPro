const Parcel = require('../models/Parcel');
const User = require('../models/User');

// CUSTOMER: Book a parcel
exports.createParcel = async (req, res) => {
    try {
        const newParcel = await Parcel.create({
            ...req.body,
            sender: req.user._id
        });
        res.status(201).json({ status: 'success', data: newParcel });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ADMIN: Get all parcels & See Metrics
exports.getAllParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find().populate('sender deliveryAgent', 'name phone');
        res.status(200).json({ status: 'success', data: parcels });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// ADMIN: Assign Agent to Parcel
exports.assignAgent = async (req, res) => {
    try {
        const { agentId } = req.body;
        const parcel = await Parcel.findByIdAndUpdate(
            req.params.id,
            { deliveryAgent: agentId, status: 'Assigned' },
            { new: true }
        );
        res.status(200).json({ status: 'success', data: parcel });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// AGENT: Update Status (Picked Up -> Delivered)
exports.updateStatus = async (req, res) => {
    try {
        const parcel = await Parcel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json({ status: 'success', data: parcel });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
// Get parcels for the logged-in Customer
exports.getMyOrders = async (req, res) => {
    try {
        const parcels = await Parcel.find({ sender: req.user._id });
        res.status(200).json({ status: 'success', data: parcels });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
// Get parcels assigned to the logged-in Agent
exports.getMyTasks = async (req, res) => {
    try {
        const parcels = await Parcel.find({ deliveryAgent: req.user._id });
        res.status(200).json({ status: 'success', data: parcels });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};