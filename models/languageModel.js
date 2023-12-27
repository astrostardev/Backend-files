const mongoose = require ('mongoose');

const languageSchema = new mongoose.Schema({
    language: [{
        name:{
            type: String,
            required: [true, "Please enter product category"],
            
        }
       
    }],
date:{
    type:Date
}
})


let Language = mongoose.model('Language',languageSchema)

module.exports = Language