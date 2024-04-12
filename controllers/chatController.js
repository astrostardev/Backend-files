const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Chat = require('../models/chatModel');
const Client = require("../models/clientModel");
const Astrologer = require("../models/astrologerModel");
const Message = require('../models/messageModel')

exports.fetchChats = catchAsyncError(async (req, res, next) => {
    try {
        const{id,userId}= req.body
        console.log('rq', id);
        const result = await Chat.find({ participants: { $elemMatch: { $eq:id} } })
            .sort({ updatedAt: -1 })
            .populate({
                path: "participants",
                select: "name" // Assuming "name" is the field you want to display
            });

       

        res.status(200).json({
            message: "success",
            chats: result,

        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



