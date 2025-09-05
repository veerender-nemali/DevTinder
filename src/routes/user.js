const express = require("express")
const userRouter = express.Router()

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequestes = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName")

        if (!connectionRequestes) {
            return res.status(400).send("No Connection Requests!")
        }

        res.json({ messsage: "Connection Requests", data: connectionRequestes })

    } catch (error) {
        res.status(400).send("Error : " + error.messsage)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName")
            .populate("toUserId", "firstName lastName")

        if (!connections) {
            return res.status(400).send({ messsage: "No Connections!" })
        }

        const data = connections.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.send({ message: "Connections fetched successfully!", data })

    } catch (error) {
        res.status(400).send("Error : " + error.messsage)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        let hideUsersFromFeed = new Set()

        connectionRequests.forEach(element => {
            hideUsersFromFeed.add(element._id)
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(connectionRequests) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName secondName")

        res.json({
            message: "User Feed!",
            data: users
        })


    } catch (error) {
        res.status(400).send("Error : " + error.messsage)
    }
})

module.exports = userRouter