const Dashboard = require("../models/Dashboard");

const getDashboardCounts = async (req, res) => {

    try {

        const data = await Dashboard.getCounts();

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    getDashboardCounts
};