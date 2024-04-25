const mongoose = require ('mongoose');

const messageSchema = new mongoose.Schema({
 senderId:{
    type : mongoose.Schema.Types.ObjectId,
    ref:"Client",
    required:true
 },
 receiverId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Astrologer",
   required: true,
},

message:{
   type:String,
   // required:true
},
audio: {
   type: String, // Store a reference to the audio (like a URL or path)
 },
createdAt:{
   type: Date, // Corrected type to Date
   default: Date.now // Default value set to current date/time
}
},
{
    timeStamp:true
})
let Message = mongoose.model('Message',messageSchema)
module.exports = Message