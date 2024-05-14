const http = require("http");
const app = require("../app"); // Ensure correct path
const WebSocket = require("ws");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to broadcast message to all clients
const broadcastMessage = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on("connection", (ws) => {
  // console.log("Client connected");

  ws.on("message", async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "setup":
        ws.userId = data.userId;
        ws.send(JSON.stringify({ type: "connected" }));
        break;

      case "get messages":
        try {
          const roomId = data.room;
          const userId = data.userId;
          let conversation = await Chat.findOne({
            participants: { $all: [userId, roomId] },
          }).populate("messages");

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
        var roomId = data.room;
        var userId = data.userId;

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

          if (newMessage) {
            conversation.messages.push(newMessage._id);
          }

          await Promise.all([conversation.save(), newMessage.save()]);

          if (newMessage) {
            broadcastMessage({
              type: "new message",
              message: chat,
              receiverId: roomId,
              senderId: userId,
              createdAt: Date.now(),
            });
            console.log("new message", newMessage);
          }
        } catch (error) {
          console.error("Error saving message:", error);
        }

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

        const audio = data.audio;
        try {
          broadcastMessage({
            type: "new message",
            audio: audio,
            receiverId: roomId,
            senderId: userId,
            createdAt: Date.now(),
          });
        } catch (error) {
          console.error("Error saving message:", error);
        }

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

      case 'call-initiate':
        ws.room = data.room;
        var roomId = data.room;
        var userId = data.userId;
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'call-notification', userId: data.userId }));
          }
        });
        break;

      case "offer":
      case "answer":
      case "ice-candidate":
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

module.exports = { server };
