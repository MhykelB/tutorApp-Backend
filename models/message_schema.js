const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: { type: String },
  sender_ID: { type: mongoose.Types.ObjectId },
});
const chatsSchema = new mongoose.Schema({
  creators_ID: { type: Array },
  chats: [messageSchema],
});

module.exports = mongoose.model("AllChats", chatsSchema);
