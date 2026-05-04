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

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

//this is a middleware, it gets executed before data is being stored in DB
connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }

    // next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequestModel