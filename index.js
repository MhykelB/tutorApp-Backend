const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const options = {
  customCssUrl: "https://unpkg.com/swagger-ui-dist@3/swagger-ui.css",
};
require("dotenv").config();
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const { Server } = require("socket.io");
const server = require("http").createServer(app);
const connectDB = require("./db/connectDB");
const authRouter = require("./routes/authRoutes");
const chatsRouter = require("./routes/chatsRoutes");
const userRouter = require("./routes/userRoutes");

const authenticateMiddleware = require("./middleware/authMiddleWare");
// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
//middleware
app.use(cors());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chats", authenticateMiddleware, chatsRouter);
app.use("/user", authenticateMiddleware, userRouter);

app.use("/api_docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc, options));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const nsp = io.of("/notices");
const chatSpace = io.of("/chatroom");
nsp.on("connection", (nsp) => {
  console.log("connected to receive notices");
  nsp.on("join-notification", (payload) => {
    nsp.join(payload);
    nsp.emit("ready-notice", " i'm ready to receive notices");
  });
  // nsp.on("disconnect", async () => {
  //   const roomUsers = io.of("/notices").clients();
  //   console.log(roomUsers);
  // });
});

chatSpace.on("connection", (socket) => {
  socket.on("joinRoom", async (payload) => {
    console.log("a user joined room " + payload);
    socket.join(payload);
    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
  socket.on("message-sent", async (payload) => {
    //  console.log(socket.id);
    const body = {
      addedMessage: payload.addedMessage,
      online: "shade",
    };
    const roomUsers = await chatSpace.in(payload.creators).fetchSockets();
    roomUsers.length < 2 ? (body.online = false) : (body.online = true);
    chatSpace.to(payload.creators).emit("update-message", body);
    if (roomUsers.length < 2) {
      // console.log(roomUsers.length + " persons");
      console.log(socket.id);
      return;
    } else {
      console.log(roomUsers.length + " multiple persons");
    }
  });
  socket.on("notice-sent", async (payload) => {
    console.log(payload.sender);
    const roomUsers = await nsp.in(payload.user2ID).fetchSockets();
    console.log(roomUsers.length + " persons");
    io.of("/notices").to(`${payload.user2ID}`).emit("new-notice", payload);
  });
});
// chatSpace.on

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
