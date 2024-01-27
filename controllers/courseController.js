const catchAsyncError = require('../middlewares/catchAsyncError')
const Course = require('../models/courseModel');
const path = require('path'); // Import the 'path' module

exports.createCourse = catchAsyncError(async (req, res, next)=>{
  let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
  
    if (req.files['images']) {
      images = req.files['images'].map(file => ({
        file: `${BASE_URL}/uploads/courseImages/${file.originalname}`
      }));
    }
    req.body.images = images;

const { coursename } = req.body;
console.log('hi', coursename);

const existingCourse = await Course.findOne({ coursename: { $regex: new RegExp(coursename, 'i') } });

if (existingCourse) {
    // Product already exists
    return res.status(409).json({
        success: false,
        message: 'Course already registered',
    });
}

   console.log('responds',req.body);
    const course = await Course.create(req.body);
    res.status(201).json({
        success: true,
     course
    })
});



exports.showCourses = catchAsyncError(async(req,res,next)=>{
    const courses = await Course.find();
  
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
    res.status(200).json({
        success: true,
        courses
    }); 
    }) 
    exports.getCourse = catchAsyncError(async(req,res,next)=>{
      const course = await Course.findById(req.params.id);
    
      // Set Content-Type to application/json
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
      res.status(200).json({
          success: true,
          course
      }); 
      }) 
      exports.updateCourse = catchAsyncError(async (req, res, next) => {
        let course = await Course.findById(req.params.id);
    let images = []
      
        if(req.body.imagesCleared === 'false' ) {
          images = course.images;
      }
        
        let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/courseImages/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    if(!course) {
      return res.status(404).json({
          success: false,
          message: "Course not found"
      });
  }

const { coursename } = req.body;
console.log('hi', coursename);

const existingCourse = await Course.findOne({ coursename: { $regex: new RegExp(coursename, 'i') } });

if (existingCourse) {
    // Product already exists
    return res.status(409).json({
        success: false,
        message: 'Course already registered',
    });
}

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
  })

  res.status(200).json({
      success: true,
      course
  })
      
     
      });
    exports.deleteCourse = catchAsyncError(async (req, res, next) => {
        const course = await  Course.findById(req.params.id);
    
        await course.deleteOne();
        res.status(200).json({
          sucess: true,
    
        })
      })