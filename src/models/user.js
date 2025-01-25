const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, required: true, minLength: 2, maxLength: 50,
    }, lastName: {
        type: String, required: true,
    }, email: {
        type: String, required: true, lowercase: true, unique: true, trim: true, validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    }, password: {
        type: String, required: true,
    }, age: {
        type: Number, required: true, validator(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        },
    }, gender: {
        type: String, required: true, validator(value) {
            if (!["MALE", "FEMALE", "OTHER"].includes(value.toUpperCase())) {
                throw new Error("Gender is not valid");
            }
        },
    }, photoUrl: {
        type: String, default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg", validator(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid");
            }
        },
    }, about: {
        type: String, maxLength: 500, default: "This is the default about me",
    }, skills: {
        type: [String], default: [],
    }
}, {
    timestamps: true,
});

//Don't use arrow functions for schema methods

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    return jwt.sign({_id: user._id.toString()}, "UNIK", {expiresIn: "7 days"});

}

userSchema.methods.validatePassword = async function (password){
    const user=this;
    const passwordHash = user.password;

    //the order of the arguments is important here
    return await bcrypt.compare(password, passwordHash);
}

userSchema.index({email: 1}, {unique: true});
const User = mongoose.model("User", userSchema);

module.exports = User;
