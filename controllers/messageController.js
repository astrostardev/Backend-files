const catchAsyncError = require('../middlewares/catchAsyncError')
const Astrologer = require('../models/astrologerModel')
const Chat = require('../models/chatModel')
const Message = require('../models/messageModel')

exports.allMessages = catchAsyncError(async(req,res, next)=>{
try{
    const messages = await Message.findOne({ chat: req.params.id})
    .populate("sender", "name email")
    .populate("reciever")
    .populate("chat")
    res.status(200).json({
        success: true,
        messages,
      });
}
catch(error){
res.status(400);
throw new Error(error.message);
}
})

exports.sendMessageToAstrologer = catchAsyncError(async(req,res,next)=>{
    try {
        const {message} = req.body;
        // console.log(message);
        const {id: paramsId} = req.params;
        const userId = req.user?._id;
        //  console.log('hi', userId);
        // console.log('paramsId',paramsId);

    const conversation = await Chat.findOne({
        participants:{$all:[userId,paramsId]}
    })
    const astrologer = await Astrologer.findById({_id:paramsId})

    if(!conversation){
        conversation = await Chat.create({
            participants:[astroId, paramsId]
        })
    }
    let newMessage = new Message({
        senderId: userId,
        receiverId: paramsId,
        message,
    })
    if(newMessage){
        conversation.messages.push(newMessage._id)
    }
    
    //this will do save opearation parallel 
   await Promise.all([conversation.save(), newMessage.save()])
    res.status(201).json({
        success:true,
        newMessage,
        latestMessage:conversation.latestMessage= newMessage._id, 
    })

   
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error:"Internal server error"})
    }
})
exports.sendMessageToUser = catchAsyncError(async(req,res,next)=>{
    try {
        const {message} = req.body;
        console.log(message);
        const {id: paramsId} = req.params;
        const astroId = req.astrologer?._id
        console.log('verifiedId', astroId);
        console.log('paramsId',paramsId);

    const conversation = await Chat.findOne({
        participants:{$all:[astroId,paramsId]}
    })
    if(!conversation){
        conversation = await Chat.create({
            participants:[astroId, paramsId]
        })
    }
    let newMessage = new Message({
        senderId: astroId,
        receiverId: paramsId,
        message,
    })
    if(newMessage){
        conversation.messages.push(newMessage._id)
    }
    //this will do save opearation parallel 
   await Promise.all([conversation.save(), newMessage.save()])

   const receiverSocketId = getReceiverSocketId(paramsId)
   if(receiverSocketId){
    //io.to(<socket_id>).emit() used to send events to spesific client
    io.to(receiverSocketId).emit("newMessage",newMessage)
   }
    res.status(201).json({
        success:true,
        newMessage
    })

   
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error:"Internal server error"})
    }
})

exports.getUserMessages = async (req, res) => {
    try {
        const { id: paramsId } = req.params;
        const userId = req.user?._id;
        // console.log('userId',userId);

        const conversation = await Chat.findOne({
            participants: { $all: [userId, paramsId] }
        }).populate("messages");
        if (!conversation) return res.status(200).json([]); // If conversation not found, return an empty array

        let messages = conversation.messages;
        // let latestMessage = messages.slice(0).reverse(); // Reverse the messages array to get the latest message first
        res.status(200).json(messages);     
     // Return the entire list of messages
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getastrologerMessages = async (req, res) => {
    try {
        const { id: paramsId } = req.params;
        const astroId = req.astrologer?._id;
        //  console.log('userId',astroId);
        const conversation = await Chat.findOne({
            participants: { $all: [astroId, paramsId] }
        }).populate("messages");
        if (!conversation) return res.status(200).json([]); // If conversation not found, return an empty array

        let messages = conversation.messages;
        // let latestMessage = messages.slice(0).reverse(); // Reverse the messages array to get the latest message first
        res.status(200).json(messages);
     // Return the entire list of messages
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAstrolatestMessages = async (req, res) => {
    try {
        const { id: paramsId } = req.params;
        const astroId = req.astrologer?._id;
        //  console.log('userId',astroId);
        const conversation = await Chat.findOne({
            participants: { $all: [astroId, paramsId] }
        }).populate("messages");
        if (!conversation) return res.status(200).json([]); // If conversation not found, return an empty array

        let messages = conversation.messages;
        let latestMsg = messages[messages.length-1]
        // let latestMessage = messages.slice(0).reverse(); // Reverse the messages array to get the latest message first
        res.status(200).json(latestMsg);
     // Return the entire list of messages
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
exports.getUserlatestMessages = async (req, res) => {
    try {
        const { id: paramsId } = req.params;
        const userId = req.user?._id;
        // console.log('userId',userId);

        const conversation = await Chat.findOne({
            participants: { $all: [userId, paramsId] }
        }).populate("messages");
        if (!conversation) return res.status(200).json([]); // If conversation not found, return an empty array

        let messages = conversation.messages;
        let latestMsg = messages[messages.length-1]

        // let latestMessage = messages.slice(0).reverse(); // Reverse the messages array to get the latest message first
        res.status(200).json(latestMsg);     
     // Return the entire list of messages
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
