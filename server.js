const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const uuid = require("uuid");

const PORT = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); // < Interesting!

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("clock", response);
};

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on('chat message', (msg) => {
    const message = {
      msg,
      id: uuid.v4()
    }
    console.log(message);
    io.emit('chat message', message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));