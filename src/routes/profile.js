const express = require("express");

const profileRouter = express.Router();

profileRouter.get("/profile", async (req,res)=>{
    try{
        //Actual Profile logic TBD
    }catch (error){
        res.status(500).json({message:error.message})
    }
})

module.exports = profileRouter;