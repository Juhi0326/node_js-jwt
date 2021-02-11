const User = require("../models/User");
const jwt = require("jsonwebtoken");

//handle errors:
handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  if (err.message === 'incorrect email!') {
    errors.email = 'this email is not registrated!'
  }

  if (err.message === 'incorrect password!') {
    errors.password = 'this password is incorrect!'
  }

  //duplicate email error code
  if (err.code === 11000) {
    errors.email = "this email is already registrated";
    return errors;
  }

  //validatinon errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const craeteToken = (id) => {
  return jwt.sign({ id }, "juhi secret", {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = craeteToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = craeteToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
    
  }
};
