const mongoose = require ('mongoose');

const messageModel = mongoose.Schema({
 sender:{

    type : mongoose.Schema.Types.ObjectId,
    ref:"Client"
 },
 reciever:{

    type : mongoose.Schema.Types.ObjectId,
    ref:"Client"
 },
 chat:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"Chat"
 }
},
{
    timeStamp:true
})
let Message = mongoose.model('Message',messageModel)
module.exports = Message