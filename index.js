const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const options = {
  customCssUrl: "https://unpkg.com/swagger-ui-dist@3/swagger-ui.css",
};
const express = require("express");
require("dotenv").config();
const app = express();
require("express-async-errors");
const cors = require("cors");
const { Server } = require("socket.io");
const server = require("http").createServer(app);
const connectDB = require("./db/connectDB");
const authRouter = require("./routes/authRoutes");
const chatsRouter = require("./routes/chatsRoutes");

const authenticateMiddleware = require("./middleware/authMiddleWare");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
//middleware
app.use(cors(corsOptions));
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chats", authenticateMiddleware, chatsRouter);
app.use("/api_docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc, options));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
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
    // console.log(payload);
    socket.join(payload);
  });
  socket.on("message-sent", (payload) => {
    console.log(socket.id);

    io.to(payload.creators).emit("update-message", payload.addedMessage);
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
