const mongoose = require ('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminSchema = new mongoose.Schema({
    email:{
       type:String
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        maxlength:[8,'Paassword cannot exceed 8 charector'],
        select:false
    }
})

adminSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password, 10) 
})
adminSchema.methods.getJwtToken = function () {
    const secret = process.env.JWT_SECRET;
    const payload = {
        adminId: this._id,
        email: this.email,
        // Other payload data if needed
    };
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN,
    };

    return jwt.sign(payload, secret, options);
};
adminSchema.methods.isValidPassword = async function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
  }
let Admin = mongoose.model('Admin',adminSchema)

module.exports = Admin