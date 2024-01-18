const mongoose = require ('mongoose');

const categorySchema = new mongoose.Schema({
    category: [{
        name:{
            type: String,
            required: [true, "Please enter product category"],
           
            
        }
       
    }],
date:{
    type:Date
}
})


let Category = mongoose.model('Category',categorySchema)

module.exports = Category