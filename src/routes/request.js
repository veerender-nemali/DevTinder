const express = require("express")
const requestRouter = express.Router()

const { userAuth } = require("../middlewares/auth.js")

requestRouter.post("/request/send/interested/:userId", userAuth, async (req, res) => {
    try {
        res.send("connection request sent!!")
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})

module.exports = requestRouter