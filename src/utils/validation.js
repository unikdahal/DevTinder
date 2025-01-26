const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password, age } = req.body;

  if (!firstName || !lastName || !email || !password || !age) {
    throw new Error("All fields are required");
  }

  if (firstName.trim().length < 2) {
    throw new Error("First name must be at least 2 characters long");
  }

  if (lastName.trim().length < 2) {
    throw new Error("Last name must be at least 2 characters long");
  }

  if (!validator.isEmail(email.trim())) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }

  if (!validator.isInt(age.toString(), { min: 18 })) {
    throw new Error("You must be at least 18 years old to sign up");
  }
};

const validateEditProfileData = (req) => {
  const {firstName, lastName,gender,age,about,photoUrl} = req.body;

    if (firstName && firstName.trim().length < 2) {
        throw new Error("First name must be at least 2 characters long");
    }

    if (lastName && lastName.trim().length < 2) {
      throw new Error("Last name must be at least 2 characters long");
    }

    if (age && !validator.isInt(age.toString(), { min: 18 })) {
      throw new Error("You must be at least 18 years old to sign up");
    }

    if(!validator.isURL(photoUrl)){
      throw new Error("Photo URL is not valid");
    }
}

module.exports = {validateSignUpData, validateEditProfileData};