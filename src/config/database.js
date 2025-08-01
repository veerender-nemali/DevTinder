const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://lazyCoder:xxxwUTDLhT3IqjVf@namastenode.ydqbwmu.mongodb.net/devTinder")
}

module.exports = connectDB
