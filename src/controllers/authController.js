const { v4: uuidv4 } = require("uuid");
const Auth = require("../models/Auth");

// Detect input type
const detectType = (input) => {
    return input.includes("@") ? "email" : "mobile";
};

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// 1️⃣ Check user
const checkUser = async (req, res) => {
    try {
        const { input } = req.body;

        const user = await Auth.findCustomer(input);

        res.json({
            success: true,
            exists: !!user,
            type: detectType(input)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


 // 2️⃣ Request OTP
const requestOTP = async (req, res) => {
    try {

        const { input, otp_type } = req.body;

        const otp = generateOTP();

        await Auth.createOTP({
            cor_id: uuidv4(),
            otp_type,
            otp_request: input,
            otp_generated_at: new Date(),
            otp_sent_at: new Date()
        });

        res.json({
            success: true,
            message: "OTP sent",
            otp // remove in production
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


 // 3️⃣ Resend OTP
const resendOTP = async (req, res) => {
    try {

        const { input } = req.body;

        const otp = generateOTP();

        await Auth.createOTP({
            cor_id: uuidv4(),
            otp_type: "resend",
            otp_request: input,
            otp_generated_at: new Date(),
            otp_sent_at: new Date()
        });

        res.json({
            success: true,
            message: "OTP resent",
            otp
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


 // 4️⃣ Verify OTP
// const verifyOTPHandler = async (req, res) => {
//     try {

//         const { input, otp } = req.body;

//         const latest = await Auth.getLatestOTP(input);

//         if (!latest) {
//             return res.status(400).json({
//                 success: false,
//                 message: "OTP not found"
//             });
//         }

//         // ⚠️ Add OTP validation logic here

//         await Auth.verifyOTP(latest.cor_id);

//         const user = await Auth.findCustomer(input);

//         res.json({
//             success: true,
//             message: "OTP verified",
//             user
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false });
//     }
// };
const verifyOTPHandler = async (req, res) => {
    try {

        const { input, otp } = req.body;

        if (!input || !otp) {
            return res.status(400).json({
                success: false,
                message: "Input and OTP are required"
            });
        }

        const latest = await Auth.getLatestOTP(input);

        if (!latest) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // ✅ 1. Check OTP match
        if (latest.otp_code != otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ✅ 2. Check OTP already used
        if (latest.otp_verified_at) {
            return res.status(400).json({
                success: false,
                message: "OTP already used"
            });
        }

        // ✅ 3. Check OTP expiry (5 mins example)
        const now = new Date();
        const generatedTime = new Date(latest.otp_generated_at);
        const diff = (now - generatedTime) / 1000; // seconds

        if (diff > 300) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        // ✅ 4. Mark as verified
        await Auth.verifyOTP(latest.cor_id);

        // ✅ 5. Get user
        const user = await Auth.findCustomer(input);

        res.json({
            success: true,
            message: "OTP verified successfully",
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};


 // 5️⃣ Register
const register = async (req, res) => {
    try {

        const { first_name, last_name, email, mobile } = req.body;

        const existing = await Auth.findCustomer(email || mobile);

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await Auth.createCustomer({
            id: uuidv4(),
            first_name,
            last_name,
            email,
            mobile
        });

        res.json({
            success: true,
            message: "User registered",
            user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

module.exports = {
    checkUser,
    requestOTP,
    resendOTP,
    verifyOTP: verifyOTPHandler,
    register
};