const express = require("express")

const app = express()

app.use("/test", (req, res) => {
    res.send("Hi from contact page");
})

app.use("/work", (req, res) => {
    res.send("Hello from home Hello page");
})

app.use("/", (req, res) => {
    res.send("Hi from home page");
})

app.listen(5555, () => {
    console.log("listening on port 5555");
})