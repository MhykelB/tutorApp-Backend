const express = require("express");

const chatsRouter = express.Router();
const {
  getOurChats,
  sendMessage,
  addUnreadMessage,
} = require("../controllers/chatsControllers");

// chatsRouter.get("/getcurrentuser", getCurrentUser);
// chatsRouter.get("/", getUsers);
chatsRouter.get("/:user2ID", getOurChats);
chatsRouter.post("/sendmessage", sendMessage);
chatsRouter.patch("/addunreadmessage/:user2ID", addUnreadMessage);
// chatsRouter.patch("/updateprofile", updatedProfile);

module.exports = chatsRouter;
