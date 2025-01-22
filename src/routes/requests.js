const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const requestRouter = express.Router();

requestRouter.post("/send/:toUserId", async (req, res) => {
    try {
        const allowedStatus = ["ignore", "interested"];
        const status = req.body.status;

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;

        const toUser = User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({message: "User not found"});
        }


        const existingRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId, toUserId}, {fromUserId: toUserId, toUserId: fromUserId}]
        });
        if (existingRequest) {
            return res.status(400).json({message: "Connection request already exists"});
        }

        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await connectionRequest.save();
        res.status(201).json(data);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = requestRouter;