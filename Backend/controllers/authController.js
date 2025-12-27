const User = require("../models/User")
const jwt = require("jsonwebtoken")
// CREATE JWT TOKEN
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
};
// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // 2. Create User
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            phone
        });

        // 3. Generate Token (we will use this for the next step)
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '90d' });

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }


        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }


        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            role: user.role,
            data: { user }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await User.find({ role: 'agent' }).select('name phone');
        res.status(200).json({ status: 'success', data: agents });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};