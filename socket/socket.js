const http = require("http");
const app = require("../app");
const WebSocket = require("ws");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const connectedClients = []; // Initialize array to store connected clients

const broadcastMessage = (message) => {
  connectedClients.forEach((client) => {
    client.send(JSON.stringify(message));
    console.log("brodcast message", message);
  });
};
wss.on("connection", (ws) => {
  console.log("Client connected");

  connectedClients.push(ws);

  ws.on("message", async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "setup":
        ws.userId = data.userId;
        console.log("Setup user:", data.userId);
        ws.send(JSON.stringify({ type: "connected" }));
        break;

      case "get messages":
        try {
          const roomId = data.room;
          console.log(roomId);

          const userId = data.userId;

          let conversation = await Chat.findOne({
            participants: { $all: [userId, roomId] },
          }).populate("messages");
          console.log(conversation?.messages);

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
        const chat = data.message;
        const roomId = data.room;
        const userId = data.userId;

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

          if (newMessage) {
            conversation.messages.push(newMessage._id);
          }
          console.log("new message", newMessage);
          await Promise.all([conversation.save(), newMessage.save()]);

          // Broadcast the new message to all connected clients
          broadcastMessage({
            type: "new message",
            message: chat,
            receiverId: roomId,
            senderId: userId,
            createdAt: Date.now(),
          });
        } catch (error) {
          console.error("Error saving message:", error);
          // Handle error appropriately
        }

        // Send a "get messages" request to retrieve updated messages
        connectedClients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: "get messages",
              room: roomId,
              userId: userId,
            })
          );
        });
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    // Remove the disconnected WebSocket from connectedClients array
    const index = connectedClients.indexOf(ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });
});

module.exports = { app, server };
