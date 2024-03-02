const mongoose = require ('mongoose');
const chatSchema = new mongoose.Schema({
    participants:[
     {
     type : mongoose.Schema.Types.ObjectId,
     ref:"Client"
    },
    {
     type : mongoose.Schema.Types.ObjectId,
     ref:"Astrologer"
    }
 ],
 messages:[{
     type : mongoose.Schema.Types.ObjectId,
     ref:"Message",
     default:[]
 }],
 latestMessage : {
     type : mongoose.Schema.Types.ObjectId,
     ref:"Message"
 },
 createdAt:{
     type: Date, // Corrected type to Date
     default: Date.now // Default value set to current date/time
 }
 },
 {
    
     timestamps: true // Use timestamps option to automatically manage createdAt and updatedAt fields
 })
 

let Chat = mongoose.model('Chat',chatSchema)
module.exports = Chat