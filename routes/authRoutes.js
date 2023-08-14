const express = require("express");
const authRouter = express.Router();
const { register, login } = require("../controllers/authControllers");
const { confirmEmail } = require("../controllers/confirmAccount");
const {
  sendResetLink,
  resetPassword,
} = require("../controllers/resetPasswordController");

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/confirmemail", confirmEmail);
authRouter.post("/resetlink", sendResetLink);
authRouter.post("/resetpassword", resetPassword);

module.exports = authRouter;
