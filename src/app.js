const express = require("express")
const connectDB = require("./config/database.js")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js")
const userRouter = require("./routes/user.js")

const app = express()

app.use(express.json()) //this will convert incoming data which is in json format into js object and handsover to req.body
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB()
    .then(() => {
        console.log("Database is now connected")

        app.listen(5555, () => {
            console.log("listening on port 5555");
        })
    }).catch(() => {
        console.log("Database is not connected")
    })
