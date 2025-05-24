import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

// io.on("connection", (socket) => {
//   console.log("Client connected");

//   socket.on("message", (msg) => {
//     console.log("Received:", msg);
//     socket.broadcast.emit("message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

io.on("connection", (socket) => {
  console.log("socket", socket);

  socket.on("message", (payload) => {
    console.log("Payload", payload);
    io.emit("message", payload);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
