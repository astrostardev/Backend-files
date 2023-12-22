const mongoose = require("mongoose");
const validator = require('validator');

const astrologerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter firstname"],
  },
  lastname: {
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
    validate: [validator.isEmail, "Please enter valid email address"],
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

  certificates: [
    {
      file: {
        type: String,
      }
    }
  ],
  profilePic: [
    {
      pic: {
        type: String
      }
    }
  ],
call:{
  type:String
},
chat:{
  type:String
},
  isActive: {
    type: Boolean,

  },
  category: {
    type: String,
    required: [true, "Please select astrologer category"],
    enum: {
        values: [
            'Electronics',
            'Mobile Phones',
            'Laptops',
            'Accessories',
            'Headphones',
            'Food',
            'Books',
            'Clothes/Shoes',
            'Beauty/Health',
            'Sports',
            'Outdoor',
            'Home'
        ],
        message : "Please select correct category"
    }
},
  createdAt: {
    type: Date,
    default: Date.now,
  },


});


let Astrologer = mongoose.model("Astrologer", astrologerSchema);

module.exports = Astrologer;