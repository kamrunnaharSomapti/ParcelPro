const User = require("../models/User");
const jwt = require("jsonwebtoken");

// CREATE JWT TOKEN
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // normalize inputs safely
        const normalizedEmail = (email || "").toLowerCase().trim();
        const normalizedRole = (role || "customer").toLowerCase().trim();

        if (!name || !normalizedEmail || !password || !phone) {
            return res.status(400).json({ message: "name, email, password, phone are required" });
        }

        // 1) Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // 2) Create User (use normalized values)
        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: normalizedRole,
            phone,
        });

        // 3) Generate Token
        const token = signToken(newUser._id);

        res.status(201).json({
            status: "success",
            token,
            data: { user: newUser },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = (email || "").toLowerCase().trim();

        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: "success",
            token,
            role: user.role,
            data: { user },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

// ADMIN/UTILITY: Get all agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: "agent" }).select("name phone");
        res.status(200).json({ status: "success", data: agents });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};
