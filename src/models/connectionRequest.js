const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", require: true,
    }, toUserId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", require: true,
    }, status: {
        type: String, enum: {
            values: ["ignore", "interested", "accepted", "rejected"], error: "{VALUE} is not supported"
        }, default: "interested"
    }
}, {
    timestamps: true
})

connectionRequestSchema.pre("save", async function () {
    const request = this;
    if (request.toUserId.equals(request.fromUserId)) {
        throw new Error("You cannot send request to yourself")
    }
})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}, {unique: true})
const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest;
