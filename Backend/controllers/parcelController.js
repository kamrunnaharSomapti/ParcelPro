const Parcel = require('../models/Parcel');
const User = require('../models/User');

function getRange(range) {
    const now = new Date();

    if (range === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return { start, end: now };
    }

    if (range === "month") {
        const start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        return { start, end: now };
    }
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { start, end: now };
}
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
        const { page = 1, limit = 10, status, search } = req.query;

        const filter = {};
        if (status) filter.status = status;

        if (search) {
            filter.$or = [
                { "pickupLocation.address": { $regex: search, $options: "i" } },
                { "deliveryLocation.address": { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
            ];
        }

        const q = Parcel.find(filter)
            .populate({ path: "sender", select: "name phone" })
            .populate({ path: "deliveryAgent", select: "name phone" })
            .populate({ path: "assignedBy", select: "name role" })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const [data, total] = await Promise.all([q, Parcel.countDocuments(filter)]);

        res.status(200).json({
            status: "success",
            data,
            meta: { total, page: Number(page), limit: Number(limit) },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// ADMIN: Assign Agent to Parcel
exports.assignAgent = async (req, res) => {
    try {
        const { agentId } = req.body;

        if (!agentId) {
            return res.status(400).json({ message: "agentId is required" });
        }

        // validate agent exists + role=agent
        const agent = await User.findOne({ _id: agentId, role: "agent" }).select("_id name phone");
        if (!agent) {
            return res.status(400).json({ message: "Invalid agentId (not an agent)" });
        }

        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) {
            return res.status(404).json({ message: "Parcel not found" });
        }

        // prevent assignment after delivery completed
        if (["Delivered"].includes(parcel.status)) {
            return res.status(400).json({ message: "Cannot assign a Delivered parcel" });
        }

        // save assignment info
        parcel.deliveryAgent = agent._id;
        parcel.assignedBy = req.user._id;
        parcel.assignedAt = new Date();
        parcel.status = "Assigned";

        // optional history
        parcel.statusHistory = parcel.statusHistory || [];
        parcel.statusHistory.push({
            status: "Assigned",
            note: `Assigned to ${agent.name}`,
            by: req.user._id,
            at: new Date(),
        });

        await parcel.save();

        // return populated
        const populated = await Parcel.findById(parcel._id)
            .populate({ path: "sender", select: "name phone" })
            .populate({ path: "deliveryAgent", select: "name phone" })
            .populate({ path: "assignedBy", select: "name role" });

        res.status(200).json({ status: "success", data: populated });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// AGENT: Update Status (Picked Up -> Delivered)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: "Parcel not found" });

        // only the assigned agent can update
        if (!parcel.deliveryAgent || String(parcel.deliveryAgent) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not allowed to update this parcel" });
        }

        parcel.status = status;
        await parcel.save();

        res.status(200).json({ status: "success", data: parcel });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// Get parcels for the logged-in Customer
// CUSTOMER: My orders (paginated + filters)
exports.getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        const filter = { sender: req.user._id };

        if (status) filter.status = status;

        if (search) {
            filter.$or = [
                { trackingId: { $regex: search, $options: "i" } },
                { "pickupLocation.address": { $regex: search, $options: "i" } },
                { "deliveryLocation.address": { $regex: search, $options: "i" } },
            ];
        }

        const q = Parcel.find(filter)
            .populate({ path: "deliveryAgent", select: "name phone" })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const [data, total] = await Promise.all([q, Parcel.countDocuments(filter)]);

        res.status(200).json({
            status: "success",
            data,
            meta: { total, page: Number(page), limit: Number(limit) },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// Get parcels assigned to the logged-in Agent
exports.getMyTasks = async (req, res) => {
    try {
        const parcels = await Parcel.find({ deliveryAgent: req.user._id })
            .populate({ path: "sender", select: "name phone" })
            .populate({ path: "assignedBy", select: "name role" })
            .sort({ createdAt: -1 });

        res.status(200).json({ status: "success", data: parcels });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// admin dashboard metrics
exports.getAdminMetrics = async (req, res) => {
    try {
        const range = (req.query.range || "today").toLowerCase();
        const { start, end } = getRange(range);

        // define "active deliveries" = not Delivered and not Failed
        const activeStatuses = ["Assigned", "Picked Up", "In Transit"];

        const [
            dailyBookings,
            failedDeliveries,
            activeDeliveries,
            activeAgents,
            activeCustomers,
            codAgg
        ] = await Promise.all([
            Parcel.countDocuments({ createdAt: { $gte: start, $lte: end } }),
            Parcel.countDocuments({ status: "Failed", updatedAt: { $gte: start, $lte: end } }),
            Parcel.countDocuments({ status: { $in: activeStatuses } }),
            User.countDocuments({ role: "agent" }),
            User.countDocuments({ role: "customer" }),

            // COD sum (if your schema uses paymentDetails.method + paymentDetails.amount)
            Parcel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end },
                        "paymentDetails.method": "COD"
                    }
                },
                { $group: { _id: null, totalCOD: { $sum: "$paymentDetails.amount" } } }
            ])
        ]);

        const codAmount = codAgg?.[0]?.totalCOD || 0;

        res.status(200).json({
            status: "success",
            data: {
                range,
                dailyBookings,
                failedDeliveries,
                codAmount,
                activeDeliveries,
                activeAgents,
                activeCustomers
            }
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// get customer's matric for dashboard
// CUSTOMER dashboard metrics
exports.getCustomerMetrics = async (req, res) => {
    try {
        const range = (req.query.range || "today").toLowerCase();
        const { start, end } = getRange(range);

        const customerId = req.user._id;

        // your definition of "active"
        const activeStatuses = ["Pending", "Assigned", "Picked Up", "In Transit"];

        const [
            totalBookings,
            activeDeliveries,
            deliveredCount,
            failedCount,
            codAgg,
        ] = await Promise.all([
            Parcel.countDocuments({
                sender: customerId,
                createdAt: { $gte: start, $lte: end },
            }),

            Parcel.countDocuments({
                sender: customerId,
                status: { $in: activeStatuses },
            }),

            Parcel.countDocuments({
                sender: customerId,
                status: "Delivered",
                updatedAt: { $gte: start, $lte: end },
            }),

            Parcel.countDocuments({
                sender: customerId,
                status: "Failed",
                updatedAt: { $gte: start, $lte: end },
            }),

            // COD total in selected range (booked in that range)
            Parcel.aggregate([
                {
                    $match: {
                        sender: customerId,
                        createdAt: { $gte: start, $lte: end },
                        "paymentDetails.method": "COD",
                    },
                },
                { $group: { _id: null, total: { $sum: "$paymentDetails.amount" } } },
            ]),
        ]);

        const codAmount = codAgg?.[0]?.total || 0;

        return res.status(200).json({
            status: "success",
            data: {
                range,
                totalBookings,
                activeDeliveries,
                deliveredCount,
                failedCount,
                codAmount,
            },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};
// get percel by id 
exports.getParcelById = async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id)
            .populate({ path: "sender", select: "name phone" })
            .populate({ path: "deliveryAgent", select: "name phone" })
            .populate({ path: "assignedBy", select: "name role" });

        if (!parcel) return res.status(404).json({ message: "Parcel not found" });

        // customer can only view their own parcel
        if (req.user.role === "customer" && String(parcel.sender?._id) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not allowed" });
        }

        return res.status(200).json({ status: "success", data: parcel });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};