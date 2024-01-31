const catchAsyncError = require('../middlewares/catchAsyncError')
const Client = require('../models/clientModel')
const APIFeatures = require("../utils/apiFeatures")
// const requestIp = require('request-ip')
// register Client-  {{base_url}}/api/v1/user/register
const  sendUserToken = require('../utils/userJwt')
exports.registerUser = async (req, res, next) => {
  try {
    let BASE_URL = process.env.BACKEND_URL;

    if (process.env.NODE_ENV === 'production') {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    // Check if the Clientalready exists
    const existingUser = await  Client.findOne({ phoneNo: req.body.phoneNo });

    if (existingUser) {
      // Clientis already registered
      return res.status(409).json({
        success: false,
        message: 'User already registered please Login',
      });
    }


    // If Clientdoesn't exist, create a new user
    const user= await Client.create(req.body);
    console.log(req.body);
    const date = new Date().toString()
    user.registerTime = date
    user.save()

    sendUserToken(user, 201, res);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};



// exports.getUserPhone = async (req, res, next) => {
  
//   try {
//     let buildQuery = () => {
//       return new APIFeatures(User.find(), req.query).search().filter()
//   }
  
//   const user = await buildQuery().query;

    
//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal Server Error',
//     });
//   }
// };


exports.loginUser = async (req, res, next) => {
  const { phoneNo } = req.body;

  console.log(phoneNo);

  try {
    if (!phoneNo) {
      throw new Error('Please enter a valid Mobile No');
    }

    // Finding the user in the database
    const user = await Client.findOne({ phoneNo });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not registered, Please Register',
      });
      return;
    }

    console.log(user);
    const date = new Date().toString()
    user.loginTime = date
    user.save()
    // const ipAddress = req.header('x-forwarded-for') ||
    //  req.socket.remoteAddress;
    // //  res.send(ipAddress);
    // console.log(ipAddress);

    const clientIp = req.clientIp;
    console.log(clientIp);

    // Additional checks, e.g., password verification, can be added here

    sendUserToken(user,200,res)

  } catch (error) {
    console.error("Error during login:", error);

    if (error instanceof Error && error.message) {
      const errorMessage = error.message;

      if (errorMessage.includes('valid Mobile No')) {
        res.status(400).json({
          success: false,
          message: errorMessage,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal Server Error',
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
};
// logout-user
exports.logoutUser = (req, res, next) => {
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

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await  Client.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});


exports.userCall = catchAsyncError(async (req, res, next) => {
  const {id, recordedTime} = req.body
  const user = await  Client.findById(id);
user.callDuration = recordedTime;
user.save()
  res.status(200).json({
    success: true,
    user,
  });
});

exports.getRechargedPackage = async (req, res, next) => {
  try {
    const { fixedPrice } = req.body;
    const user = await Client.findById(req.params.id);

    if (!user) {
      return `Package not found with this id ${req.params.id}`;
    }
    // const fixedPrice = user.packages.fixedPrice
    const recharge = fixedPrice
    console.log('fixedPrice',recharge);
    user.rechargePrice.push({ price: recharge });
    const calculateTotalAmount = (prices) =>
    prices.reduce((total, priceObj) => total + Number(priceObj.price || 0), 0).toString();
    const currentDate = Date.now(); // Assuming currentDate is the current date
  
  // Assuming user.rechargePrice is an array of objects with a price property
  user.balance = calculateTotalAmount(user.rechargePrice);
  user.rechargePrice.push({ price: fixedPrice, date: currentDate });
  
  // If you want to update the user's balance after adding a new price
  user.balance = calculateTotalAmount(user.rechargePrice);
  

    // Save the updated package
    const updatedPackage = await user.save();

    res.status(200).json({
      success: true,
      updatedPackage,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return `Error in updatePackageAndTotalAmount: ${error.message}`;
  }
};
exports.rechargePackage = async(req,res,next)=>{
   const{packages}=req.body
  const user = await  Client.findById(req.params.id);
   user.packages = packages;
   user.save()

  res.status(200).json({
    success: true,
    user,
  });
}

// getAlluser -  {{base_url}}/api/v1/user/users

exports.getAllUser = catchAsyncError(async(req,res,next)=>{
    const users = await Client.find();
    res.status(200).json({
      success:true,
      users
     }) 
  })
// updateuser -  {{base_url}}/api/v1/user/update/:id

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const user = await Client.findById(req.params.id)
  console.log('user id',req.params.id);
if(!user){
  console.log('user not find');
}else{
  console.log('user found',user);
}
  console.log('userDetail', req.body);
  const { name, dob, placeOfbirth, address, city,country,state,email,postalCode,gender } = req.body; // Destructure properties from req.body

  const userProfile = {
    name,
    dob,
    placeOfbirth,
    address,
    city,
    country,
    state,
    email,
    postalCode,
    gender 
  };

  try {
    const user = await Client.findByIdAndUpdate(req.params.id, userProfile, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // Handle any errors that occurred during the update
    next(error);
  }
});

  
// deleteuser -  {{base_url}}/api/v1/user/delete/:id

  exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await  Client.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
    })
  })