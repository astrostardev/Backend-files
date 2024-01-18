const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
coursename:{
 type:String,
 required: [true, "Please enter Course name"],

},
  price: {
    type: String,
    required: [true, "Please enter Price"],
  },
  description: {
    type: String,
     required: [true, "Please enter Details"],
  },
  category: [],
  images: [
    {
        image: {
            type: String,
            required: true
        }
    }
],
  isActive: {
    type: Boolean,
    // required: [true, "Please Select Option"],
  },

});
let Course = mongoose.model("Course", courseSchema);
module.exports = Course;
