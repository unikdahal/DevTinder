const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")
const userAuth = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/send/:toUserId", userAuth, async (req, res) => {
    try {
        const allowedStatus = ["ignore", "interested"];
        const status = req.body.status;

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;

        const toUser = await User.findById(toUserId);
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

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const requestId = req.params.requestId;

        const allowedStatus = ["accepted", "rejected"];
        const status = req.params.status;

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status"});
        }

        //populate the user id from the connection request so that the user can review the request based on user details
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId, toUserId: user._id, status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoURL"]);
        if (!connectionRequest) {
            return res.status(404).json({message: "Request not found"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.status(200).json({message: "Connection request reviewed successfully", data});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




module.exports = requestRouter;