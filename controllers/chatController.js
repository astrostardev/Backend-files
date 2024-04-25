const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Chat = require('../models/chatModel');
const Client = require("../models/clientModel");
const Astrologer = require("../models/astrologerModel");
const Message = require('../models/messageModel')
exports.fetchChats = catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.body;
  
      const result = await Chat.find({ participants: { $elemMatch: { $eq: id } } })
    //   let result= await Chat.findOne({
    //     participants: { $all: [from, to] },
    //   }).sort({ updatedAt: -1 })
        .populate({
          path: 'participants',
          select: 'name',
        })
        .populate({
          path: 'messages',
          options: { sort: { createdAt: -1 }, limit: 1 }, // Get only the latest message
        });
  
      // To get the latest message for each chat
      const formattedChats = result.map((chat) => {
        const latestMessage = chat.messages[0]; // Assuming there's always at least one message
        return {
          ...chat.toObject(), // Convert the Mongoose document to a plain JavaScript object
          latestMessage, // Include the latest message
        };
      });
  
      res.status(200).json({
        message: 'success',
        chats: formattedChats,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });



