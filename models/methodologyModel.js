const mongoose = require ('mongoose');

const methodSchema = new mongoose.Schema({
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


let Methodology = mongoose.model('Methodology',methodSchema)

module.exports = Methodology