const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");

const packagesSchema = new mongoose.Schema({
fixedPrice:{
 type:String
},
  packageName: {
    type: String,
    required: [true, "Please enter Package Name"],
  },
  packageDetail: {
    type: String,
    required: [true, "Please enter Details"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    required: [true, "Please Select Option"],
  },

});
let Packages = mongoose.model("Packages", packagesSchema);
module.exports = Packages;
