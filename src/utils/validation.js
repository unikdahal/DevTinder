const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password, age } = req.body;
  if (!firstName || !lastName || !email || !password || !age) {
    throw new Error("All fields are required");
  }

  if (firstName.length < 2) {
    throw new Error("First name must be at least 2 characters long");
  }

  if (lastName.length < 2) {
    throw new Error("Last name must be at least 2 characters long");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (age < 18) {
    throw new Error("You must be at least 18 years old to sign up");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }

  if (!validator.isInt(age)) {
    throw new Error("Age must be a number");
  }
};

module.exports = validateSignUpData;
