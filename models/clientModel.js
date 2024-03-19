const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');

const clientSchema = new mongoose.Schema({
  userID:{
    type:String
      }, 
      referralCode:{
type:String
      },
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
    timeOfbirth:{
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

      packages: {
        type:Array
      }

      ,
      callDuration:{
        type:String
      },
      rechargePrice: [
        {
          name:{
   type:String
          },
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
    },
   referralCode:{
      type:String,
      default: null, 
      allowNull: true
    },
    welcomeBonus:{
      type:String
    },
    welcomeRefBonus:{type:String},
    referedAmount:{type:String},
    referedUsersCount:{
      type:String
    },
    chatDetails:[{
      astrologer:{
        type:String
      },
      date:{
        type:String
      },
      chatTime:{
        type:String
      },
      spentAmount:{
         type:String
      }
    }
   
    ],
},{
  timeStamp:true,
})

clientSchema.methods.getJwtToken = function () {
  const secret = process.env.JWT_SECRET;
  const payload = {
      clientId: this._id,
      phoneNo: this.phoneNo,
      // Other payload data if needed
  };
  return jwt.sign(payload, secret);
};
let Client = mongoose.model('Client',clientSchema)

module.exports = Client