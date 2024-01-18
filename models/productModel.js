const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
productname:{
 type:String,
 
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
        type: String
      }
    }
  ],
  isActive: {
    type: Boolean,
    // required: [true, "Please Select Option"],
  },

});
let Product = mongoose.model("Product", productSchema);
module.exports = Product;
