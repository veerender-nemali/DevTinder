const express = require("express")
const connectDB = require("./config/database.js")

const app = express()



connectDB()
    .then(() => {
        console.log("Database is now connected")

        app.listen(5555, () => {
            console.log("listening on port 5555");
        })
    }).catch(() => {
        console.log("Database is not connected")
    })
