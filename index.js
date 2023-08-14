const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);
const cors = require("cors");
require("express-async-errors");
const connectDB = require("./db/connectDB");
const authRouter = require("./routes/authRoutes");
const chatsRouter = require("./routes/chatsRoutes");
require("dotenv").config();
const authenticateMiddleware = require("./middleware/authMiddleWare");

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/chats", authenticateMiddleware, chatsRouter);

app.get("/", (req, res) => {
  res.send("working pretty well");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  // console.log(socket.id);
  socket.broadcast.emit("alert", {
    message: `you are online`,
  });
  socket.on("joinRoom", (payload) => {
    console.log(payload);
    socket.join(payload);
  });
  socket.on("message-sent", (payload) => {
    console.log(payload.addedMessage);
    socket.to(payload.creators).emit("update-message", payload.addedMessage);
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL).then(() => {
      console.log("connected to database");
    });
    server.listen(8000, () => {
      console.log("listening on port 8k");
    });
  } catch (error) {
    console.log(error);
  }
};
start();

module.exports = server;
