const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const uuid = require("uuid");
const randomColor = require("randomcolor");

const PORT = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = process.env.REACT_APP_DEPLOYED ?
  socketIo(server) :
  socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

const CHAT_MSG_STRING = "chat message";
const ID_INFO_STRING = "id info";
const TIME_STRING = "clock";

/* Emits new time */
const getTimeAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit(TIME_STRING, response);
};

let interval;

io.on("connection", (socket) => {
  const newUserColor = randomColor({
    format: "rgba",
    seed: socket.id,
    alpha: 0.5
  });

  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getTimeAndEmit(socket), 1000);

  /* Sends unique info to new connection */
  socket.emit(ID_INFO_STRING, {
    userId: socket.id,
    color: newUserColor
  });

  /* Sends an announcement that a new user has joined */
  io.emit(CHAT_MSG_STRING, {
    userId: socket.id,
    color: newUserColor,
    msgId: uuid.v4(),
    msg: "A new user has joined in with this color. Please welcome them!"
  });

  /* Sends chat messages to all users */
  socket.on(CHAT_MSG_STRING, msgPacket => {
    const message = {
      ...msgPacket,
      msgId: uuid.v4()
    }
    io.emit('chat message', message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));