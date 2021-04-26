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

  socket.emit("id info", {
    id: socket.id,
    color: randomColor({
      format: "rgba",
      seed: socket.id,
      alpha: 0.25
    })
  })

  socket.on('chat message', (msg) => {
    const message = {
      ...msg,
      id: uuid.v4()
    }
    io.emit('chat message', message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));