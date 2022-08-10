const ACTIONS = require("../src/Actions");
const express = require("express");
const App = express();
const http = require("http").createServer(App);
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJs } = require("./executeJs");
let cors = require("cors");

const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:8080/"],
  },
});

App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(cors());

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
  res.send("<h2>Welcome to the Live Code Share</h2>");
});

App.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "Empty! Code not found" });
  }
  console.log(language);
  console.log(code);
  try {
    const filePath = await generateFile(language, code);
    let output;
    if (language === "py") {
      output = await executePy(filePath);
    } else if (language === "js") {
      output = await executeJs(filePath);
    } else {
      output = await executeCpp(filePath);
    }
    return res.status(200).json({ filePath, output });
  } catch (err) {
    res.status(500).json({ err });
  }
});

io.on("connection", (socket) => {
  // console.log("Socket Connected", socket.id);
  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    // console.log("User joined successfully");
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // console.log("New 4 = " + JSON.stringify(clients));
    // console.log(ACTIONS.JOINED);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // console.log("Working again", code);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    // console.log("Code = " + code);
    // console.log("SocketId = " + socketId);
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
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
