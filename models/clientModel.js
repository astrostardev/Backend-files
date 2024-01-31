const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');

const clientSchema = new mongoose.Schema({
    name:{
       type:String,
    //    required:[true,'Please enter name'] 
    },
    dob:{
      type:String
    },
    email:{type:String},
    phoneNo:{
        type:String,
        required:[true,'Please enter mobile-no'],
        unique:[true,'Mobile no alreday exist']
    },
    placeOfbirth:{
      type:String
    },
    postalCode:{
      type:String
    },
    city:{
     type:String
    },
    state:{
      type:String
     },
     country:{
    type:String
     },
     gender: {
      type: String,
  
    },
     address:{
   type:String
     },
    registerTime: {
        type: Date,
        // default: Date.now,
      },
    loginTime: {
        type: Date,
        // default: Date.now,
      }, 
     packages:{
     fixedPrice:{type:String},
     packageName:{type:String},
     packagePrice:[{price:{type:String}}],
     packageDetail:{type:String},
     totalAmount:{type:String},
     _id:{type:String}
     },
      callDuration:{
        type:String
      },
      rechargePrice: [
        {
          price: {
            type: String, 
          },
          date: {
            type: Date,
          },
        },
      ],
      
    balance:{
      type:Number
    }
})
clientSchema.methods.getJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const payload = {
      clientId: this._id,
      phoneNo: this.phoneNo,
      // Other payload data if needed
  };
  const options = {
      expiresIn: process.env.JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, secret, options);
};
let Client = mongoose.model('Client',clientSchema)

module.exports = Client