const { Server } = require('socket.io');
const http = require('http')
const express = require('express')
const path = require("path")
const app = require("../app");
const Chat = require('../models/chatModel');

const server = http.createServer(app)

const io = new Server (server,{
    cors:{
        origin:"*",
    },
    pingTimeout:60000,
});


io.on('connection', (socket)=>{
//    console.log("a user connected", socket.id);
    
socket.on("setup astro",(astrologer)=>{
     console.log('astrologer',astrologer);
    socket.join(astrologer[0]._id);
      console.log("astrologer[0]._id", astrologer[0]._id);
     socket.emit("connected")
   });
   socket.on("setup",(user)=>{
    
    // console.log('user',user);
    socket.join(user._id);
    //  console.log("user.data._id", user._id);
     socket.emit("connected")

   });
   //get existing chats
   socket.on("join chat",(room)=>{
    socket.join(room)  // room parameter has the Id of user chat with whom 
     console.log("user joined room",room);
   });

   socket.on("new message",(newMessageStatus)=>{
    var chat = newMessageStatus;
    console.log('chat id',chat.newMessage._id , 'messsage', chat.newMessage.message);
    socket.in(chat.newMessage._id).emit("message received", chat.newMessage.message)

    //  if(!chat.users){
    //     return console.log("chat.user not definied");
    //  }
    //  chat.users.forEach((user)=>{
    //     if(user._id == newMessageStatus.sender._id) return;
    //  })
   })

    // const userId = socket.handshake.query.userId
    // console.log('soketUserId:',userId);
    // if(userId != "undefined") userSocketMap[userId] = socket.id;
    // //io.emit()is used to send events to alll the connected clients
    // io.emit("getOnlineUsers",Object.keys(userSocketMap));
    // socket.on("disconnect",()=>{
    //     console.log("user disconncted", socket.id);
    //     delete userSocketMap[userId];
    // io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // })
})
module.exports = { app, io, server};
