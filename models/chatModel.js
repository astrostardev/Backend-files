const mongoose = require ('mongoose');

const chatModel = mongoose.Schema({
    chatName:{
        type:String
    },
     users:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"Client"
        }
     ],
     latestMessage : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Message"
     }
},{
    timeStamp:true
})

let Chat = mongoose.model('Chat',chatModel)
module.exports = Chat