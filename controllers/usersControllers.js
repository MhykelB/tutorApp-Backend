const userSchema = require("../models/user_schemas");

const getCurrentUser = async (req, res) => {
  try {
    const user = await userSchema.findOne(
      {
        _id: req.user.userID,
      },
      { token: 0, password: 0 }
    );
    user && res.status(200).json({ currentUser: user });
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
};
const updateProfile = async (req, res) => {
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
const getUsers = async (req, res) => {
  // return one user
  const { userID } = req.query;
  if (userID) {
    try {
      const oneUser = await userSchema.findOne(
        {
          _id: userID,
        },
        { token: 0, password: 0 }
      );
      oneUser && res.status(200).json({ user: oneUser });
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
  // return every user except the one logged in
  const allUsers = await userSchema.find(
    {
      username: {
        $nin: req.user.username,
      },
      tutor: true,
    },
    { token: 0, password: 0 }
  );
  if (allUsers) {
    res.status(200).json({ allUsers, user: req.user });
  } else {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  getCurrentUser,
  getUsers,
  updateProfile,
};
