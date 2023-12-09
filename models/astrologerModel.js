const mongoose = require("mongoose");
const validator = require('validator');
//  const {nanoid} = require("nanoid")

const astrologerSchema = new mongoose.Schema({
  // astrologerID: {
  //   type: String,
  //   required: true,
  //   default: () => nanoid(6),
  //   index: { unique: true },
  // },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },

});
astrologerSchema.methods.getJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const payload = {
      astrologerId: this._id,
      mobilePrimary: this.mobilePrimary,
      // Other payload data if needed
  };
  const options = {
      expiresIn: process.env.JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, secret, options);
};
let Astrologer = mongoose.model("Astrologer", astrologerSchema);

module.exports = Astrologer;