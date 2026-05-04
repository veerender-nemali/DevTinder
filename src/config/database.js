const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error("Database connection error:", error.message)
        throw error
    }
}

module.exports = connectDB
