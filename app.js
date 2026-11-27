const express=require('express');
const app=express();
const path=require("path");
//configure socketio
const http= require("http");

const socketio=require("socket.io"); 

const server = http.createServer(app);

//io is the main Socket.IO server instance.
//socketio() attaches socket.io to a plain Node.JS HTTP server listening on port 3000.
const io= socketio(server); 

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));

//function gets executed whenever a new client is connected to Socket.IO server
//this function executes separately for every new client connection
//socket represents one particular client's connection.
//Every connected client gets a unique socket ID

io.on("connection", function(socket){
  socket.on("send-location", function (data){
    //io.emit() broadcasts "received-location" to all connected clients
    io.emit("received-location",{id: socket.id,...data}) 
  });

  //we don't need to manually emit a "disconnect" event from the client, Socket.IO handles it automatically  
  socket.on("disconnect",function(){
    io.emit("user-disconnected",socket.id);
  })
})

app.get("/",function(req,res){
  res.render("index");
});

server.listen(3000,()=>{console.log("Server listening at http://localhost:3000");}); 