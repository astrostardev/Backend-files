const catchAsyncError = require('../middlewares/catchAsyncError')
const Admin = require('../models/adminModel')
const ErrorHandler=require('../utils/errorHandler')
const sendToken = require('../utils/jwt')

//registerAdmin  -  {{base_url}}/api/v1/admin/register
exports.registerAdmin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === 'production') {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
  }

  const admin = await Admin.create({
      email,
      password,
  });

  // Set cookies and send response
  sendToken(admin, 201, res);
});

 //loginAdmin - {{base_url}}/api/v1/admin/login
 exports.loginAdmin = catchAsyncError(async(req, res, next)=>{
   const{email,password }= req.body
 
   if(!email||!password){
     return next(new ErrorHandler('Please enter name,password',400))
   }
   //finding the user database
 
   const admin = await Admin.findOne({email}).select('+password');
   if(!admin){
     return next(new ErrorHandler('Invalid email or password ',401))
   }
   if(!await admin.isValidPassword(password)){
     return next(new ErrorHandler('Invalid email or password ',401))
   }
   sendToken(admin,200,res)

 
 })

//logout-admin

exports.logoutAdmin = (req, res, next) => {
  // Clear the 'token' cookie
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  // Assuming you have access to the token in the request (e.g., req.user.token)
  const token = req.user ? req.user.token : null;

  // Send the response after setting the cookie, including the token
  res.status(200).json({
    success: true,
    message: "Logged out",
    token: token, // Include the token in the response if needed
  });
};
