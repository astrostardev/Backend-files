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
    const singlePackage = await  Packages.findById(req.params.id);
    if (!singlePackage) {
      return next(
        new ErrorHandler(`User not found with this id ${req.params.id}`)
      );
    }
    res.status(200).json({
      success: true,
      singlePackage,
    });
  });
  
exports.createPackages = async (req, res, next) => {

  
  const { packageName } = req.body;
  console.log('hi',   packageName);

  const existingProduct = await Packages.findOne({   packageName: { $regex: new RegExp(  packageName, 'i') } });

  if (existingProduct) {
    // Product already exists
    return res.status(409).json({
        success: false,
        message: 'Package already registered',
    });
}
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
  let package = await Packages.findById(req.params.id);
   
  const newPackage = ({
      fixedPrice,
      packageName,
      packagePrice,
      packageDetail,
      isActive} = req.body)    
      if (newPackage.packageName !== package.packageName) {
        // Product name has been modified, check for existence
        const existingPackage = await Packages.findOne({
          packageName: { $regex: new RegExp(packageName, 'i') },
        });
    
        if (existingPackage) {
          // Product with the new name already exists
          return res.status(409).json({
            success: false,
            message: 'Package already registered',
          });
        }
      }
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

