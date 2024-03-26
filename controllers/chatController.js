const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Chat = require('../models/chatModel');
const Client = require("../models/clientModel");
const Astrologer = require("../models/astrologerModel");

exports.accessChat = catchAsyncError(async (req, res, next) => {
    const {userId} = req.body
    if(!userId){
        console.log("UserId not found with this request");
        return res.sendStatus(400)
    }
    const isChat = await Chat.find({
     $and: [{users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:req.user._id}}}] 
    }) .popuate("users","-password")
    .popuate("latestMessage")
    isChat = await Client.popuate(isChat,{
        path:"latesMessage.sender",
        select:"name email"
    })
if(isChat.length > 0){
    res.send(isChat[0])
}else{
    var chatData = {
        chatName:"sender",
        users:[re.user._id, userId]
    };
    try{
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({_id: createdChat._id}, 
            "users",
            "-password")
            res.status(200).json(FullChat);

    }catch(error){
     res.status(400);
     throw new ErrorHandler(error.message)
    }
}

  
});

exports.fetchChats = catchAsyncError(async (req, res, next) => {
    try {
        console.log('rq',req.params.id);
        const result = await Chat.find({ participants: { $elemMatch: { $eq: req.params.id } } })
        .sort({ updatedAt: -1 })
        .populate({
            path: "participants",
            select: "name",
        })
       
    res.status(200).json({
        message: "success",
        chats: result
    });
    
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
