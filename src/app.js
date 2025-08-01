const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")

const app = express()

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Veerender",
        lastName: "Nemali",
        age: 24,
        emailId: "veerender@nemali.com",
        password: "veer@1234"
    })

    try {
        await user.save()
        res.send("User data saved successfully")
    } catch (err) {
        res.status(400).send("Error saving user data to DB" + err.message)
    }
})

connectDB()
    .then(() => {
        console.log("Database is now connected")

        app.listen(5555, () => {
            console.log("listening on port 5555");
        })
    }).catch(() => {
        console.log("Database is not connected")
    })
