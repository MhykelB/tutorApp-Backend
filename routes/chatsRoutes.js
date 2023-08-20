const express = require("express");

const chatsRouter = express.Router();
const {
  getUsers,
  getOurChats,
  sendMessage,
  updatedProfile,
  getCurrentUser,
  addUnreadMessage,
} = require("../controllers/mainControllers");

chatsRouter.get("/getcurrentuser", getCurrentUser);
chatsRouter.get("/", getUsers);
chatsRouter.get("/:user2ID", getOurChats);
chatsRouter.post("/sendmessage", sendMessage);
chatsRouter.post("/addunreadmessage/:user2ID", addUnreadMessage);
chatsRouter.patch("/updateprofile", updatedProfile);

module.exports = chatsRouter;
