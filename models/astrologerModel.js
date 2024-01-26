const mongoose = require("mongoose");
const validator = require('validator');

const astrologerSchema = new mongoose.Schema({
  astrologerID:{
type:String
  },
  firstname: {
    type: String,
    required: [true, "Please enter firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter lastname"],
  },
  displayname: {
    type: String,
    required: [true, "Please enter lastname"],
  },
  dob: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    // validate: [validator.isEmail, "Please enter valid email address"],
  },
  mobilePrimary: {
    type: String,
    required: [true, "Please enter mobile-no"],
    unique: true,
  },
  mobileSecondary: {
    type: String,
    unique: true,
  },

  address: {
    type: String,
  },
  district: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: String,
  },
  gender: {
    type: String,
    required: [true, "Please enter gender"],

  },
  qualifications: {
    type: String,
  },
  experience: {
    type: String,
    required: [true, " Please Enter year of experience"],
  },

  course: {
    type: String,
  },
  institute: {
    type: String,
  },

  astrologyDescription: {
    type: String,
  },
  biograph:{
    type:String
  },
  astrologyExperience: {
    type: String,
  },
  astrologyExpertise: {
    type: String,
  },
  knowus: {
    type: String,
  },
  maxTime: {
    type: String,
  },

  certificatePic: [
    {
      file: {
        type: String,
        required: [true, " Please upload Certificate"],

      }
    }
  ],
  profilePic: [
    {
      pic: {
        type: String,
        required: [true, " Please upload Profile Image"],

      }
    }
  ],
  aadharPic: [
    {
      pic: {
        type: String,
        required: [true, " Please upload aadhar Image"],

      }
    }
  ],
 panPic: [
    {
      pic: {
        type: String,
        required: [true, " Please upload PanCard Image"],

      }
    }
  ],
call:{
  type:String
},
chat:{
  type:String
},
displaycall:{
  type:String
},
displaychat:{
  type:String
},
  isActive: {
    type: Boolean,

  },
  category: [],
  language:[{type:String}],
  createdAt: {
    type: Date,
    default: Date.now,
  },


});


let Astrologer = mongoose.model("Astrologer", astrologerSchema);

module.exports = Astrologer;