const catchAsyncError = require('../middlewares/catchAsyncError')
const CourseCategory = require('../models/courseCategoryModel')

exports.createCourseCategory = async (req, res, next) => {
  try {
    let BASE_URL = process.env.BACKEND_URL;

    if (process.env.NODE_ENV === 'production') {
      BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    // Check if the Clientalready exists
    const existingCategory = await  CourseCategory.findOne({ category: req.body.category });

    if (existingCategory) {
      // Clientis already registered
      return res.status(409).json({
        success: false,
        message: 'Category already registered',
      });
    }


    // If Clientdoesn't exist, create a new user
    const category= await CourseCategory.create(req.body);
    console.log(req.body);
    // const date = new Date().toString()
    // category.date = date
    // category.save()

    res.status(200).json({
      success: true,
      category,
    });
  } 
  
  catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.showCoursesCategory = catchAsyncError(async(req,res,next)=>{
    const courseCategories  = await CourseCategory.find();
  
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
    res.status(200).json({
        success: true,
        courseCategories 
    }); 
    }) 
    exports.getCourseCategory = catchAsyncError(async(req,res,next)=>{
      const courseCategory = await CourseCategory.findById(req.params.id);
    
      // Set Content-Type to application/json
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
      res.status(200).json({
          success: true,
          courseCategory
      }); 
      }) 
      exports.updateCourseCategory = catchAsyncError(async(req,res,next)=>{
        const{category} = req.body
          const upcategory = await CourseCategory.findByIdAndUpdate(req.params.id,category,{
           new:true,
           runValidators: true,
         })
       
         res.status(200).json({
           success:true,
           upcategory
          }) 
     })
     
    exports.deleteCourseCategory = catchAsyncError(async (req, res, next) => {
        const course = await  CourseCategory.findById(req.params.id);
    
        await course.deleteOne();
        res.status(200).json({
          sucess: true,
    
        })
      })