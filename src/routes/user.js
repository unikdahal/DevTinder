const express = require("express")
const userAuth = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");


//get all the pending connection requests for the logged in user
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const requests = await ConnectionRequests.find({
            toUserId: user._id, status: "interested"
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const requests = await ConnectionRequests.find({
            $or: [{fromUserId: user._id, status: "accepted"}, {toUserId: user._id, status: "accepted"}]
        }).populate({
            path: 'toUserId', match: {fromUserId: user._id, status: "accepted"}
        }).populate({
            path: 'fromUserId', match: {toUserId: user._id, status: "accepted"}
        });

        const connectionRequests = requests.map(request => {
            if (request.toUserId._id.toString() === user._id.toString()) {
                return request.toUserId;
            } else {
                return request.fromUserId;
            }
        })

        res.status(200).json(connectionRequests);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // User should see all the other user cards except
        //     - his own
        //     - his connections
        //     - ignored people
        //     - people who have ignored him
        //     - people who have sent him a request
        //     - people to whom he has sent a request

        const user = req.user;
        //if there is entry of user on connection request table, then all the other people card shouldn't be seen
        const connectionRequests = await ConnectionRequests.find({
            $or: [{fromUserId: user._id}, {toUserId: user._id}]
        }).select("fromUserId toUserId");

        const hiddenUserFromFeeds = new Set();
        connectionRequests.forEach(request => {
            hiddenUserFromFeeds.add(request.fromUserId.toString());
            hiddenUserFromFeeds.add(request.toUserId.toString());
        })

        const users = await User.find({
            _id: {$nin: [user._id, ...hiddenUserFromFeeds]}
        }).select("firstName lastName photoURL gender");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


module.exports = userRouter;