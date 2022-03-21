const express = require("express");
const dgram = require("dgram");
// If we want to accept forms and such
const bodyParser = require("body-parser");
const {Server} = require("socket.io");

const app = express();
const udpServer = dgram.createSocket("udp4");

// TCP
app.set("port", (process.env.PORT || 5000))
const TCPServer = app.listen(app.get("port"), () => {
    console.log(`Server has started on http://localhost:${app.get('port')}`)
});
// Setting up sockets
const io = new Server(TCPServer)

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("index")
});

udpServer.on("message", (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
    io.emit("data", `Data: ${msg}`);
})

udpServer.on("listening", () => {
    const address = udpServer.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

// UDP
udpServer.bind(41234);

// Socket.io
io.on("connection", (socket) => {
    console.log("A user connected");
})