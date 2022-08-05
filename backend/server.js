const express = require("express")
const http = require("http")
const {Server} = require("socket.io")

const App = express()
const server = http.createServer(App)
const io = new Server(server)

io.on("connection", (socket) => {
    console.log("Socket connected", socket.id)
})


const PORT = process.env.PORT || 5000
server.listen(PORT, ()=>{
    console.log(`Listening on the port ${PORT}`)
})


