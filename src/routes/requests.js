const express = require("express");

const requestRouter  = express.Router();

requestRouter.post("/sendConnectionRequest",async (req,res)=>{
    try{
        //Actual Send Connection Request logic TBD
    }catch (error){
        res.status(500).json({message:error.message})
    }
})

module.exports = requestRouter;
