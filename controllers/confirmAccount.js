const userSchema = require("../models/user_schemas");
const jwt = require("jsonwebtoken");

const confirmEmail = async (req, res) => {
  const reqHeaders = req.headers.authorization;
  if (!reqHeaders) {
    return res.status(400).json({ message: "unathorized" });
  }
  if (reqHeaders.startsWith("Bearer")) {
    const token = reqHeaders.split(" ")[1];
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (!email) {
      return res.status(400).json({ message: "unathorized, no token" });
    }
    const findUser = await userSchema.findOne({ token: token, email: email });
    if (!findUser) {
      return res.status(400).json({ message: "user doesnt exist" });
    }
    findUser.set({ active: true });
    await findUser.save();
    return res.status(200).json({ message: "email confirmed" });
  }
};

module.exports = { confirmEmail };
