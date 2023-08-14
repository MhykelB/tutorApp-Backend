const express = require("express");

const chatsRouter = express.Router();
const {
  getUsers,
  getOurChats,
  sendMessage,
  updatedProfile,
} = require("../controllers/mainControllers");

chatsRouter.get("/", getUsers);
chatsRouter.get("/:user2ID", getOurChats);
chatsRouter.post("/sendmessage", sendMessage);
chatsRouter.patch("/updateprofile", updatedProfile);

module.exports = chatsRouter;
