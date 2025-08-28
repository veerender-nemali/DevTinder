const express = require("express")
const requestRouter = express.Router()

const { userAuth } = require("../middlewares/auth.js")
const ConnectionRequest = require("../models/connectionRequest.js")

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status

        //corner-case : 1
        const allowedStatuses = ["interested", "ignored"]
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type : " + status
            })
        }

        //corner-case : 2
        const isUserAvailableInDB = await ConnectionRequest.findById({ toUserId })
        if (!isUserAvailableInDB) {
            return res.status(400).json({
                message: "User is not available"
            })
        }

        //corner-case : 3 & 4 combined
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists!"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
            message: status === "interested" ? "Request sent succesfully!!" : "Ignored succesffuly!!",
            data
        })
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})

module.exports = requestRouter