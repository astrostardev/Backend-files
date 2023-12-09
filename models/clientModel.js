const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');

const clientSchema = new mongoose.Schema({
    name:{
       type:String,
    //    required:[true,'Please enter name'] 
    },
    phoneNo:{
        type:String,
        required:[true,'Please enter mobile-no'],
        unique:[true,'Mobile no alreday exist']
    },
    registerTime: {
        type: Date,
        // default: Date.now,
      },
    loginTime: {
        type: Date,
        // default: Date.now,
      }, 
      callDuration:{
        type:String
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