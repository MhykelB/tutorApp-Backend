const userSchema = require("../models/user_schemas");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendMail } = require("./utils/mailer");
const hashPassword = require("./utils/hashPassword");

const sendResetLink = async (req, res) => {
  const { email } = req.body;
  // check for user with email
  const isUser = await userSchema.findOne({ email: email });
  if (!isUser) {
    return res.status(400).json({ message: "user with email doesnt exist" });
  }
  if (isUser) {
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: 1200,
    });
    // add token to isuer property
    isUser.set({
      token: token,
    });
    await isUser.save();
    const mailInfo = await sendMail(
      email,
      "reset",
      `https://google.com/${token}`,
      "Password reset"
    );
    //send link to email, using node mailer.
    return res.status(201).json({
      mesaage: "reset link sent to email",
      token: token,
      mailInfo,
    });
  }
};

const resetPassword = async (req, res) => {
  // async function hashPassword(input) {
  //   const salt = await bcrypt.genSalt(10);
  //   const hash = await bcrypt.hash(input, salt);
  //   return hash;
  // }
  const { newPassword } = req.body;
  const reqHeaders = req.headers.authorization;
  if (!newPassword || !reqHeaders) {
    return res.status(404).json({ message: "Missing authentication, pele" });
  }
  if (reqHeaders.startsWith("Bearer")) {
    const token = reqHeaders.split(" ")[1];
    if (token) {
      try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET); // token is an email object
        if (email) {
          const isUser = await userSchema.findOne({
            token: token,
            email: email,
          });
          if (!isUser) {
            return res.status(404).json({ message: "User doesn't exist" });
          }
          isUser.set({
            password: await hashPassword(newPassword),
            token: " ",
          });
          await isUser.save();
          return res.status(200).json({ message: "password reset successful" });
        }
      } catch (err) {
        return res.status(500).json({ message: err });
      }
    }
  } else {
    return res
      .status(404)
      .json({ message: "Unathourized to access this route, pele" });
  }

  // if (isUser) {
  //   isUser.set({ password: newPassword });
  // }
};

module.exports = { sendResetLink, resetPassword };
