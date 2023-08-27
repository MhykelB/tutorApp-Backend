const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const single_messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true },
  { _id: false }
);
const unread_messagesSchema = new mongoose.Schema({
  sender_ID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "include sender's name"],
  },
  sender_username: {
    type: String,
    required: [true, "include sender's name"],
  },
  messages: {
    type: [single_messageSchema],
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    tutor: {
      type: Boolean,
    },
    token: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      maxLength: 200,
    },
    subject: {
      type: [String],
    },
    sex: {
      type: String,
      enum: ["male", "female"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    unread_messages: {
      type: [unread_messagesSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function () {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   // console.log(this.password);
// });

userSchema.methods.createJWT = async function () {
  const token = jwt.sign(
    { userID: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: 5000 }
  );
  return token;
};
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
