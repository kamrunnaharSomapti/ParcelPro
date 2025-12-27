const User = require("../models/User");

// In a controller file
exports.getAgents = async (req, res) => {
    const agents = await User.find({ role: 'agent' });
    res.status(200).json({ status: 'success', data: agents });
};