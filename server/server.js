const ACTIONS = require("../src/Actions");
const App = require("express")();
const http = require("http").createServer(App);
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:8080"],
  },
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

App.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);
  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
  socket.on("join", ({ roomId, userName }) => {
    console.log("User joined successfully");
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log("New 4 = " + JSON.stringify(clients));
    console.log(ACTIONS.JOINED);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  console.log(`Listening on the port ${PORT}`);
});
