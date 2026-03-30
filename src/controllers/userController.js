const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // 1️⃣ Find user
        const user = await User.findByUsername(username);

        if (!user || user.is_delete || !user.is_active) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 3️⃣ Generate token
        const token = jwt.sign(
            {
                emp_id: user.emp_id,
                username: user.username,
                role_id: user.role_id
            },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "1d" }
        );

        // 4️⃣ Remove password before sending response
        const { password: _, ...userData } = user;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userData,
                token
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    loginUser
};