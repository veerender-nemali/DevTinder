const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            }
        }
    },
    { timestamps: true }
);

connectionRequestSchema.index({ firstName: 1, lastName: 1 })

//this is a middleware, it gets executed before data is being stored in DB
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Connot send connection request to yourseld!")
    }

    next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel