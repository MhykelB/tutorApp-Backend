const express = require("express");

const chatsRouter = express.Router();
const {
  getUsers,
  getOurChats,
  sendMessage,
} = require("../controllers/mainControllers");

chatsRouter.get("/", getUsers);
chatsRouter.get("/:user2ID", getOurChats);
chatsRouter.post("/", sendMessage);

module.exports = chatsRouter;
