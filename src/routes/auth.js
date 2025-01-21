const express = require("express");
const authRouter = express.Router();


authRouter.post("/signup", async (req,res)=>{
    try{
        //Actual Sign Up logic TBD
    }catch (error){
        res.status(500).json({message:error.message})
    }
})

authRouter.post("/login", async (req,res)=>{
    try{
        //Actual Login logic TBD
    }catch (error){
        res.status(500).json({message:error.message})
    }
})

authRouter.post("/logout", async (req,res)=>{
    try{
        //Actual Logout logic TBD
    }catch (error){
        res.status(500).json({message:error.message})
    }
})
module.exports = authRouter;