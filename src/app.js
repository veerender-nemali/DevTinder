const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")

const app = express()

app.use(express.json()) //this will convert incoming data which is in json format into js object and handsover to req.body

app.post("/signup", async (req, res) => {
    //creating a new instance of a user model
    const user = new User(req.body) //req.body => has js object

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
