const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try {
        const {token} = req.cookies;
        if (!token) {
            return res.status(401).send({error: "You are not authenticated"});
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedObj;
        const user = User.findById(_id);
        if (!user) {
            return res.status(401).send({error: "User not Found"});
        }

        req.user = user;
        next();
    }catch (error){
        res.status(401).send({error: "You are not authenticated"});
    }
}

module.exports = userAuth;