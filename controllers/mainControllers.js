const chatsSchema = require("../models/message_schema");
const userSchema = require("../models/user_schemas");

const getUsers = async (req, res) => {
  // return every usr except the one logged in
  const { userID } = req.query;
  if (userID) {
    try {
      const oneUser = await userSchema.findOne(
        {
          _id: userID,
        },
        { token: 0 }
      );

      oneUser && res.status(200).json({ user: oneUser });
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
  const allUsers = await userSchema.find(
    {
      username: {
        $nin: req.user.username,
      },
      tutor: true,
    },
    { token: 0 }
  );
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
  // im popping of the msg sent which is automatically the last on the list, sending to f.e where it would be concated to the exisitng array
  const addedObj = isChat.chats.slice(-1)[0];
  if (!isChat) {
    return res
      .status(500)
      .json({ message: "something went wrong  postn message" });
  }

  res.status(200).json(addedObj);
};

// patch request to update profile
const updatedProfile = async (req, res) => {
  try {
    const user = await userSchema.findOneAndUpdate(
      { _id: req.user.userID },
      req.body,
      { new: true }
    );
    if (user) {
      return res.status(200).json({ message: "profile updated", user });
    }
  } catch (err) {
    return res.status(200).json(err);
  }
};

module.exports = {
  getUsers,
  getOurChats,
  sendMessage,
  updatedProfile,
};
