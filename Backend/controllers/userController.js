const User = require("../models/User");

// In a controller file
exports.getAgents = async (req, res) => {
    const agents = await User.find({ role: 'agent' });
    res.status(200).json({ status: 'success', data: agents });
};
// get all users with pagination role, search
exports.getAllUsers = async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }

    const q = User.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    const [data, total] = await Promise.all([q, User.countDocuments(filter)]);

    res.status(200).json({
        status: "success",
        data,
        meta: { total, page: Number(page), limit: Number(limit) },
    });
};