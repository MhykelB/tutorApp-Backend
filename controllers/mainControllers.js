const chatsSchema = require("../models/message_schema");
const userSchema = require("../models/user_schemas");
// const { Server } = require("socket.io");
// const server = require("../index");

// const io = new Server(server, {
//   // cors: {
//   //   origin: "*",
//   // },
// });

const getUsers = async (req, res) => {
  // return every usr except the one logged in
  const allUsers = await userSchema.find({
    username: {
      $nin: req.user.username,
    },
    tutor: true,
  });
  if (allUsers) {
    res.status(200).json({ allUsers, user: req.user });
  } else {
    res.status(500).json({ message: "something went wrong" });
  }
};

const getOurChats = async (req, res) => {
  const obj = {};
  const { userID } = req.user;
  const { user2ID } = req.params;
  //check for exising conversation history
  const chatDocument = await chatsSchema.findOne({
    creators_ID: {
      $all: [userID, user2ID],
    },
  });

  if (chatDocument) {
    return res.status(200).json({
      chatEntry: chatDocument,
    });
    //if there is no existing conversation history create an empty array
  } else if (chatDocument === null) {
    obj.creators_ID = [userID, user2ID];
    obj.chats = [];
    const newObj = await chatsSchema.create(obj);
    return res
      .status(200)
      .json({ chatEntry: newObj, message: "created new chat entry" });
  } else {
    res.status(500).json({ message: "sometin went wrong gettin d cahts" });
  }
};

const sendMessage = async (req, res) => {
  const { userID } = req.user;
  const { user2ID, message } = req.body;
  const obj = { chats: { message, sender_ID: userID } };
  //check for exising conversation history and update
  const isChat = await chatsSchema.findOneAndUpdate(
    {
      creators_ID: {
        $all: [userID, user2ID],
      },
    },
    { $push: { chats: obj.chats } },
    { new: true }
  );
  // im popping of the msg sent which is the last, sending to f.e awhere it would be concated to the exisiing array
  const addedObj = isChat.chats.slice(-1)[0];
  if (!isChat) {
    return res
      .status(500)
      .json({ message: "something went wrong  postn message" });
  }

  res.status(200).json(addedObj);
  // if (isChat) {
  //   const appendChatObj = isChat.chats.concat(obj.chats);
  //   isChat.set({ chats: appendChatObj });
  //   const newDoc = await isChat.save();
  //   if (newDoc) {
  //     return res.status(200).json(newDoc);
  //   } else {
  //     res
  //       .status(500)
  //       .json({ message: "something went wrong with post message" });
  //   }
  // }
  // //if there is no existing conversation history
  // else {
  //   obj.creators_ID = [userID, user2ID];
  //   obj.chats = [{ message, sender_ID: userID }];
  //   const newObj = await chatsSchema.create(obj);
  //   if (newObj) {
  //     res.status(201).json({ chat: newObj });
  //   } else {
  //     res.status(500).json({ message: "something went wrong" });
  //   }
  // }
};

module.exports = {
  getUsers,
  getOurChats,
  sendMessage,
};
