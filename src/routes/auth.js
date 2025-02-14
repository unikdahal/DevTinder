const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const passport = require("passport");
require("../config/passport");

// Sign up route
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const {firstName, lastName, email, password, age, gender, about} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: passwordHash,
            age,
            gender,
        });
        const savedUser = await user.save();
        const token = await savedUser.generateAuthToken();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 604800000),
        });
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login route
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        if (!validator.isEmail(email.trim())) {
            return res.status(400).json({ message: "Please provide a valid email" });
        }

        const user = await User.findOne({ email: email.trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const verifyPassword = await user.validatePassword(password);
        if (!verifyPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = await user.generateAuthToken();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 604800000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        res.status(200).json(user);
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Logout route
authRouter.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google OAuth routes
authRouter.get('/google/login',
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

authRouter.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false
    }),
    async (req, res) => {
        try {
            const token = await req.user.generateAuthToken();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 604800000),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
            res.redirect('http://localhost:5173/feed');
        } catch (error) {
            console.error('Google Auth Callback Error:', error);
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = authRouter;