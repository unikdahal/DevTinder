const express = require("express")
const userAuth = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");


//get all the pending connection requests for the logged in user
userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const user = req.user;
        let requests = await ConnectionRequests.find({
            toUserId: user._id, status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "about", "age", "_id"]);
        requests = requests.map(request => request.fromUserId);
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
        }).populate("fromUserId toUserId");

        const connectionRequests = requests.map(request => {
            if (request.fromUserId._id.toString() === user._id.toString()) {
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
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // Get all connection requests involving the user
        const connectionRequests = await ConnectionRequests.find({
            $or: [{fromUserId: user._id}, {toUserId: user._id}]
        }).select("fromUserId toUserId status");

        const hiddenUserFromFeeds = new Set();
        //if user hasn't sent any connection request add him to the hiddenUsers
        hiddenUserFromFeeds.add(user._id);
        connectionRequests.forEach(request => {
            hiddenUserFromFeeds.add(request.fromUserId.toString());
            hiddenUserFromFeeds.add(request.toUserId.toString());
        });

        // Exclude the user, their connections, and other specified users from the feed
        const users = await User.find({
            _id: {$nin: [user._id, ...hiddenUserFromFeeds]}
        }).select("firstName lastName photoUrl gender about age")
            .skip(skip)
            .limit(limit);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


module.exports = userRouter;