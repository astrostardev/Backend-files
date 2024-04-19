const http = require("http");
const app = require("../app");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { Readable } = require('stream');

const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
    // console.log("broadcast message", message);
  });
};

wss.on("connection", (ws) => {
  // console.log("Client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "setup":
        ws.userId = data.userId;
     
        // console.log("Setup user:", data.userId);
        ws.send(JSON.stringify({ type: "connected" }));
        break;

      case "get messages":
        try {
          const roomId = data.room;
          // console.log(roomId);

          const userId = data.userId;

          let conversation = await Chat.findOne({
            participants: { $all: [userId, roomId] },
          }).populate("messages");
          // console.log(conversation?.messages);

          ws.send(
            JSON.stringify({
              type: "messages",
              messages: conversation?.messages,
            })
          );
        } catch (error) {
          console.error("Error in getMessages:", error);
          ws.send(
            JSON.stringify({ type: "error", message: "Internal server error" })
          );
        }
        break;

      case "new message":
        ws.room = data.room;
        var chat = data.message;
        // var audio = data.audio
        var roomId = data.room;
        var userId = data.userId;

        // Save the new message to the database asynchronously
        try {
          let conversation = await Chat.findOne({
            participants: { $all: [userId, roomId] },
          });
          if (!conversation) {
            conversation = await Chat.create({
              participants: [userId, roomId],
            });
          }
          let newMessage = new Message({
            senderId: userId,
            receiverId: roomId,
            message: chat,
          });
          // let newAudio = new Message({
          //   senderId: userId,
          //   receiverId: roomId,
          //   audio: audio,
          // });

          if (newMessage) {
            conversation.messages.push(newMessage._id);
          }
          // if (audio) {
          //   conversation.messages.push(newAudio._id);
          // }

          await Promise.all([conversation.save(), newMessage.save()]);

          // Broadcast the new message to all connected clients
          if(newMessage){
            broadcastMessage({
              type: "new message",
              message: chat,
              receiverId: roomId,
              senderId: userId,
              createdAt: Date.now(),
            });
          console.log("new message", newMessage);

          }
          // else{
          //   broadcastMessage({
          //     type: "new message",
          //     audio:audio,
          //     receiverId: roomId,
          //     senderId: userId,
          //     createdAt: Date.now(),
          //   });
          // console.log("new audio", newAudio);

          // }

        
        } catch (error) {
          console.error("Error saving message:", error);
          // Handle error appropriately
        }

        // Send a "get messages" request to retrieve updated messages
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: "get messages",
              room: roomId,
              userId: userId,
            })
          );
        });
        break;

    case "new audio":
        ws.room = data.room;
        var roomId = data.room;
        var userId = data.userId;
         console.log('senderId',userId);
         console.log('userId',roomId);

        const audio = data.audio;
        // Save the new message to the database asynchronously
        try {
          let conversation = await Chat.findOne({
            participants: { $all: [userId, roomId] },
          });
          if (!conversation) {
            conversation = await Chat.create({
              participants: [userId, roomId],
            });
          }
          let newMessage = new Message({
            senderId: userId,
            receiverId: roomId,
            audio: audio,
          });

          if (newMessage) {
            conversation.messages.push(newMessage._id);
          }
          console.log("new message", newMessage);
          await Promise.all([conversation.save(), newMessage.save()]);

          // Broadcast the new message to all connected clients
          broadcastMessage({
            type: "new message",
            audio:audio,
            receiverId: roomId,
            senderId: userId,
            createdAt: Date.now(),
          });
        } catch (error) {
          console.error("Error saving message:", error);
          // Handle error appropriately
        }

        // Send a "get messages" request to retrieve updated messages
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: "get messages",
              room: roomId,
              userId: userId,
            })
          );
        });
        break;


      // case "audioStream":
      //   // Broadcast the audio data to all connected clients except the sender
      //   wss.clients.forEach((client) => {
      //     if (client !== ws && client.readyState === WebSocket.OPEN) {
      //       client.send(data.audioData);
      //     }
      //   });
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

module.exports = { app, server };
