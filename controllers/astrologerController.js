const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Astrologer = require("../models/astrologerModel");
const APIFeatures = require("../utils/apiFeatures");
const sendAstroToken = require("../utils/astroJwt");
const jwt = require("jsonwebtoken");
//registerAstrologer - {{base_url}}/api/v1/astrologer/register
exports.registerAstrologer = catchAsyncError(async (req, res, next) => {
  // let BASE_URL = process.env.BACKEND_URL;\

  let BASE_URL = process.env.BACKEND_URL
  
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;

  }

  try {
    let certificateUrls = [];
    let picUrls = [];
    let aadharUrls = [];
    let pancardUrls = [];

    if (req.files['certificatePic']) {
      certificateUrls = req.files['certificatePic'].map(file => ({
        file: `${BASE_URL}/uploads/certificates/${file.originalname}`
      }));
    }

    if (req.files['profilePic']) {
      picUrls = req.files['profilePic'].map(file => ({
        pic: `${BASE_URL}/uploads/profilepic/${file.originalname}`
      }));
    }

    if (req.files['aadharPic']) {
      aadharUrls = req.files['aadharPic'].map(file => ({
        pic: `${BASE_URL}/uploads/aadharImage/${file.originalname}`
      }));
    }

    if (req.files['panPic']) {
      pancardUrls = req.files['panPic'].map(file => ({
        pic: `${BASE_URL}/uploads/pancardImage/${file.originalname}`
      }));
    }

    req.body.certificatePic = certificateUrls;
    req.body.profilePic = picUrls;
    req.body.aadharPic = aadharUrls;
    req.body.panPic = pancardUrls;

    const astrologer = await Astrologer.create(req.body);

    await astrologer.save();

    sendAstroToken(astrologer,200,res)


  } catch (error) {
    return next(new ErrorHandler(error.message), 500);
  }
});


//updateAstrologer - {{base_url}}/api/v1/astrologer/update/:id
exports.updateAstrologer = catchAsyncError(async (req, res, next) => {
 
  // let BASE_URL = process.env.BACKEND_URL;
  // if (process.env.NODE_ENV === "production") {
  //   BASE_URL = `${req.protocol}://${req.get("host")}`;
  // }
  let   BASE_URL = `${req.protocol}://${req.get("host")}`;
 
  const updateFields = {};

  if (req.files['certificatePic']) {
    updateFields.certificatePic = req.files['certificatePic'].map(file => ({
      file: `${BASE_URL}/uploads/certificates/${file.originalname}`
    }));
  } 
  
  if (req.files['profilePic']) {
    updateFields.profilePic = req.files['profilePic'].map(file => ({
      pic: `${BASE_URL}/uploads/profilepic/${file.originalname}`
    }));
  }
  if (req.files['aadharPic']) {
    updateFields.aadharPic = req.files['aadharPic'].map(file => ({
      pic: `${BASE_URL}/uploads/aadharImage/${file.originalname}`
    }));
  } 
  if (req.files['panPic']) {
    updateFields.panPic = req.files['panPic'].map(file => ({
      pic: `${BASE_URL}/uploads/pancardImage/${file.originalname}`
    }));
  } 
  console.log(updateFields);
  const astrologer = await Astrologer.findByIdAndUpdate(
    req.params.id,
    { ...req.body,...updateFields },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    astrologer,
  });
});

//deleteAstrologer - {{base_url}}/api/v1/astrologer/delete/:id
exports.deleteAstrologer = catchAsyncError(async (req, res, next) => {
  const astrologer = await Astrologer.findById(req.params.id);
  if (!astrologer) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  await astrologer.deleteOne();
  res.status(200).json({
    success: true,
  });
});

//getAllAstrologer - {{base_url}}/api/v1/astrologer/allAstrologers
exports.getAllAstrologers = catchAsyncError(async (req, res, next) => {
  try {
    const astrologers = await Astrologer.find();
    res.status(200).json({
      success: true,
      astrologers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message), 500);
  }
});

//getAstrologer - {{base_url}}/api/v1/astrologer/getAstrologer/:id
exports.getAstrologer = catchAsyncError(async (req, res, next) => {
  const astrologer = await Astrologer.findById(req.params.id);
  if (!astrologer) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    astrologer,
  });
});

exports.getAstrologerPhone = async (req, res, next) => {
  try {
    // Assuming your surrounding function is marked as `async`
    let buildQuery = () => {
      return new APIFeatures(Astrologer.find(), req.query).search().filter();
    };

    const astrologerQuery = buildQuery();
    const astrologer = await astrologerQuery.query;
    const secret = process.env.JWT_SECRET;
    const payload = req.query.mobilePrimary;
    console.log(req.query);
    const token = jwt.sign(payload, secret);

    const data = astrologer.map((astrologer) => `${astrologer.isActive}`);
    console.log(data);
    if (data == false) {
      console.log("Astrologer cant login contact admin");
    } else {
      //  sendAstroToken(astrologer,200,res)

      res.status(200).json({
        success: true,
        astrologer,
        token,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.getAstrologerByCategory = async (req, res, next) => {
  try {
    const categoryValue = req.query.category;
    const regex = new RegExp(categoryValue, "i");
    const astrologer = await Astrologer.find({ category: regex });
    console.log("cate", req.query);
    res.status(200).json({
      success: true,
      astrologer,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
exports.searchAstrologerByName = async (req, res, next) => {
  try {
    const displayName = req.query.search;
    const regex = new RegExp(displayName, "i");
    const astrologer = await Astrologer.find({ displayname: regex });
    console.log("cate", req.query);
    res.status(200).json({
      success: true,
      astrologer,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
exports.getAstrologerByLanguage = async (req, res, next) => {
  try {
    const languageValue = req.query.language;
    const regex = new RegExp(languageValue, "i");
    const astrologer = await Astrologer.find({ language: regex });
    console.log("cate", req.query);
    res.status(200).json({
      success: true,
      astrologer,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
exports.logoutAstrologer = (req, res, next) => {
  // Clear the 'token' cookie
  res.cookie("token", null, {
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
exports.availableAstrologer = catchAsyncError(async (req, res, next) => {
  const astrologer = await Astrologer.findById(req.params.id);
  if (!astrologer) {
    return next(
      new ErrorHandler(`User not found with this id ${req.params.id}`)
    );
  }
  const {callAvailable,emergencyCallAvailable,chatAvailable} =req.body

  astrologer.callAvailable = callAvailable
  astrologer.chatAvailable = chatAvailable
  astrologer.emergencyCallAvailable = emergencyCallAvailable

  astrologer.save()

  res.status(200).json({
    success: true,
    astrologer,
  });
});
exports.getAvailableAstrologerByCall = async (req, res, next) => {
  try {
    // const callAvailable = req.query.callAvailable === 'true'; // Check for the string 'true'
    const astrologers = await Astrologer.find({ callAvailable: true });
    
    res.status(200).json({
      success: true,
      astrologers,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.getAvailableAstrologerByChat = async (req, res, next) => {
  try {
    // const chatAvailable = req.query.chatAvailable == 'true';
    const astrologers = await Astrologer.find({ chatAvailable: true });
    console.log("cate", req.query);
    res.status(200).json({
      success: true,
      astrologers,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.getAstrologerForSidebar = async(req,res,next)=>{
  try {

    const loggedInAstrologerId = req.astrologer._id
    const allAstrologer = await Astrologer.find({_id: {$ne: loggedInAstrologerId}})
    res.status(200).json(allAstrologer)
  } catch (error) {
    
  }
}
