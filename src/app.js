const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")

const app = express()

app.use(express.json()) //this will convert incoming data which is in json format into js object and handsover to req.body

//storing data in DB from user
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

//getting data from DB
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId  //request has come from the user

    try {
        const user = await User.find({ emailId: userEmail }) //it works based on User schema model,if emailId is in user model then it can be found in DB
        if (user.length === 0) {
            res.status(400).send("User not found!!")
        } else {
            res.send(user)
        }
    } catch (error) {
        res.status(400).send("Something went wrong!")
    }

})

//updating user data 
app.patch("/user", async (req, res) => {
    const data = req.body
    const userId = data.userId

    try {
        const user = await User.findByIdAndUpdate({ _id: userId }, data)
        // console.log(user)
        // if (!user) {
        //     res.status(400).send("User not found!!")
        // } else {
        res.send("Successfully updated the user Data")
        // }

    } catch (error) {
        res.status(400).send("Something went wrong while updating user data to DB")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId

    try {
        const user = await User.findByIdAndDelete({ _id: userId })
        res.send("successfully deleted user from DB")
    } catch (error) {
        res.status(400).send("Something went wrong while deleting user data from DB")
    }
})

//getting all data from DB
app.get('/feed', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send("Something went wrong!")
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
