const express = require("express");

const userRouter = express.Router();
const {
  getCurrentUser,
  updateProfile,
  getUsers,
} = require("../controllers/usersControllers");

userRouter.get("/", getCurrentUser);
userRouter.get("/get-tutors", getUsers);
userRouter.patch("/updateprofile", updateProfile);

module.exports = userRouter;
