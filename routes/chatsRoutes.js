const express = require("express");

const chatsRouter = express.Router();
const {
  getUsers,
  getOurChats,
  postMessage,
} = require("../controllers/mainControllers");

chatsRouter.get("/", getUsers);
chatsRouter.get("/:user2ID", getOurChats);
chatsRouter.post("/", postMessage);

module.exports = chatsRouter;
