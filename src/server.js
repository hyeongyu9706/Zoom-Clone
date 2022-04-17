import express from "express";
import http from "http";
import WebSocket from "ws";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"))
app.get("/*",(_,res)=>res.redirect("/"))

const handleListen=()=>console.log(`Listen on http://localhost:3000`)
// app.listen(3000,handleListen);

const server = http.createServer(app);

const wss = new WebSocket.Server({server})

function onSocketMessage(message) {
       
}
function onSocketClose() {
    console.log("Disconnected from the Browser")
}
function handleOpen() {
    console.log("Connected to Server")
}
// socket.addEventListener("open",handleOpen)

const sockets = [];

wss.on("connection", (socket) => {
    // console.log(socket)
    sockets.push(socket);
    socket['nickname']=`Anon_${sockets.length}`
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        console.log(msg.toString(),socket.nickname);
        const message = JSON.parse(msg.toString());
        switch (message.type) {
            case "new_message":
                
                sockets.forEach(aSocket =>  aSocket.send(`${socket.nickname}: ${message.payload}`))
                break;
            case "nickname":
                socket['nickname'] = message.payload;
        }
   
        // console.log(message.toString());
       
    });
    // socket.send("hello!!")
});

server.listen(3000, handleListen)

// {
//     type: "message",
//     payload:"hello everyone!"
// }
// {
//     type: "nickname",
//     payload:"hello everyone!"
// }