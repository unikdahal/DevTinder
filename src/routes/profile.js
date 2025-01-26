const express = require("express");
const userAuth = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth,async (req,res)=>{
    try{
        const user = req.user;
        res.status(200).json(user);
    }catch (error){
        res.status(500).json({message:error.message})
    }
})

profileRouter.patch("/update",userAuth,async (req,res)=> {
    try {
        const user = req.user;
        validateEditProfileData(req);
        const {firstName, lastName, gender, age, about, photoUrl} = req.body;
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender,
            age,
            about,
            photoUrl
        }, {new: true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

module.exports = profileRouter;