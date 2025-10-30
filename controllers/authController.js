import db from '../models/index.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { User } = db;

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !user.password) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "supersecretkey",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const testLogin = (req, res) => {
    res.send('Login is working');
};
