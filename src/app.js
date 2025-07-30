const express = require("express")

const app = express()

//this method is middlerware for 1st route handler
app.use("/", (req, res, next) => {
    next()
})

app.get(
    '/user',
    //this method is middlerware for 1st route handler
    (req, res, next) => {
        console.log('Handling /user route')
        next()
    },
    (req, res, next) => {
        res.send("1st route handler")
    }
)

app.listen(5555, () => {
    console.log("listening on port 5555");
})