const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const uuid = require("uuid");
const randomColor = require("randomcolor");

const PORT = process.env.PORT || 4001;
const index = require("./routes/index");
const { emit } = require("process");

const app = express();
app.use(index);

const server = http.createServer(app);

/* Apply CORS for localhost if serving locally */
const io =
  socketIo(server, process.env.REACT_APP_DEPLOYED ? {} : {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

const CHAT_MSG_EVENT = "chat message";
const ID_INFO_EVENT = "id info";
const TIME_EVENT = "clock";

/* Emits new time */
const emitNewTime = () => {
  const response = new Date();

  io.emit(TIME_EVENT, response);
};

/* Emits chat message */
const emitChatMessage = (msgPacket) => {
  const message = {
    color: msgPacket.color,
    userId: msgPacket.userId,
    msg: msgPacket.msg,
    msgId: uuid.v4()
  }

  io.emit(CHAT_MSG_EVENT, message);
}

let interval;
let clientCount = 0;

io.on("connection", (socket) => {
  const newUserColor = randomColor({
    format: "rgba",
    seed: socket.id,
    alpha: 0.5
  });

  console.log("New client connected");
  clientCount++;

  /* Sets up regular interval to update server time */
  if (clientCount === 1) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => emitNewTime(), 1000);
  }

  /* Sends unique info to new connection */
  socket.emit(ID_INFO_EVENT, {
    userId: socket.id,
    color: newUserColor
  });

  /* Sends an announcement that a new user has joined */
  emitChatMessage({
    userId: "server",
    color: newUserColor,
    msg: "A new user has joined in with this color. Please welcome them!"
  });

  /* Sends chat messages to all users */
  socket.on(CHAT_MSG_EVENT, emitChatMessage);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clientCount--;

    if (clientCount < 1) {
      clearInterval(interval);
      clientCount = 0;
    }
  });
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));