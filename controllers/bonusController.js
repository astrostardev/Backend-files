const catchAsyncError = require('../middlewares/catchAsyncError');
const Bonus = require('../models/BonusModel');
const ErrorHandler = require('../utils/errorHandler');
exports.createBonusAmount = (async(req,res,next)=>{
 try{
    const bonus = await Bonus.create(req.body)

    res.status(200).json({
        success: true,
        bonus
      });
 }
 catch(error){
    return next(new ErrorHandler(error.message), 500);

 }
   
})
exports.getBonusAmount = (async(req,res,next)=>{
   try{
      const bonus = await Bonus.find()
  
      res.status(200).json({
          success: true,
          bonus
        });
   }
   catch(error){
      return next(new ErrorHandler(error.message), 500);
  
   }
     
  })
exports.editBonusAmount = (async(req,res,next)=>{
   const bonus = await Bonus.findById(req.params.id)
  console.log('user id',req.params.id);
if(!bonus){
  console.log('not find');
}else{
  console.log('user found',bonus);
}
   try{
      const bonus = await Bonus.findByIdAndUpdate(req.params.id,req.body,{
         new: true,
         runValidators: true,
       })
  
      res.status(200).json({
          success: true,
          bonus
        });
   }
   catch(error){
      return next(new ErrorHandler(error.message), 500);
  
   }
     
  })