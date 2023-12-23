const Packages = require('../models/packages')
const catchAsyncError = require('../middlewares/catchAsyncError')


exports.showPackages = catchAsyncError(async(req,res,next)=>{
  const packages = await Packages.find();

  // Set Content-Type to application/json
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.status(200).json({
      success: true,
      packages
  }); 
  }) 

  
  exports.getPackage= catchAsyncError(async (req, res, next) => {
    const package = await  Packages.findById(req.params.id);
    if (!package) {
      return next(
        new ErrorHandler(`User not found with this id ${req.params.id}`)
      );
    }
    res.status(200).json({
      success: true,
      package,
    });
  });
  
exports.createPackages = async (req, res, next) => {
    try {

      const packages = await  Packages.create(req.body);
      res.status(200).json({
        success: true,
        packages
      });
    }catch(err){
        console.error("Error during user registration:", err);
      res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
    }
}  

exports.updatePackages = catchAsyncError(async(req,res,next)=>{
    const newPackage = ({
      fixedPrice,
      packageName,
      packagePrice,
      packageDetail,
      isActive} = req.body)
     const packages = await Packages.findByIdAndUpdate(req.params.id,newPackage,{
      new:true,
      runValidators: true,
    })
  
    res.status(200).json({
      success:true,
      packages
     }) 
})

exports.deletePackages= catchAsyncError(async (req, res, next) => {
    const package = await  Packages.findById(req.params.id);

    await package.deleteOne();
    res.status(200).json({
      sucess: true,

    })
  })

