const mongoose = require ('mongoose');

const courseCategorySchema = new mongoose.Schema({
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


let CourseCategory = mongoose.model('CourseCategory',courseCategorySchema)

module.exports = CourseCategory