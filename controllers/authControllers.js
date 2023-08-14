const userSchema = require("../models/user_schemas");
// const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { sendMail } = require("./utils/mailer");
const hashPassword = require("./utils/hashPassword");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ message: "invalid credentials" });
  }
  req.body.password = await hashPassword(password);
  const confirmToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: 500,
  });
  req.body.token = confirmToken;
  await userSchema.createIndexes({ username: 1, email: 1 });
  let newUser = await userSchema.create(req.body);
  if (!newUser) {
    throw error;
  }
  // const mailInfo = await sendMail(
  //   email,
  //   "verify",
  //   `https://google.com/${confirmToken}`,
  //   "Confirm your tutorApp account"
  // );
  return res.status(201).json({
    success: true,
    message: "account created, link sent",
    // mailInfo,
    // token: confirmToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("something went wrong");
  }
  const user = await userSchema.findOne({ email: email });
  if (!user) {
    throw new Error("something went wrong wt email");
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    throw new Error("something went wrong with password");
  }
  // generate token
  // const token = jwt.sign({userID:user._id, username:user.username},process.env.JWT_SECRET,{expiresIn:'30d'})
  const token = await user.createJWT();
  res.status(200).json({ success: true, message: "login successful", token });
};

module.exports = { register, login };
