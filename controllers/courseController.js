const catchAsyncError = require('../middlewares/catchAsyncError')
const Course = require('../models/courseModel');
const path = require('path'); // Import the 'path' module

exports.createCourse = catchAsyncError(async (req, res, next)=>{
  let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
  
        req.files?.forEach( file => {
            let url = `${BASE_URL}/uploads/courseImages/${file.originalname}`;
            images.push({ image: url })
        })
    

    req.body.images = images;

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
    exports.updateCourse = catchAsyncError(async(req,res,next)=>{
      const newCourseData = ({
        coursename,
        price,
        description,
        category,
        isActive

     } = req.body)
     let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
  
        req.files?.forEach( file => {
            let url = `${BASE_URL}/uploads/courseImages/${file.originalname}`;
            images.push({ image: url })
        })
    

    req.body.images = images;
         const course = await Course.findByIdAndUpdate(req.params.id,newCourseData,{
          new:true,
          runValidators: true,
        })
      
        res.status(200).json({
          success:true,
          course
         }) 
    })
    
    exports.deleteCourse = catchAsyncError(async (req, res, next) => {
        const course = await  Course.findById(req.params.id);
    
        await course.deleteOne();
        res.status(200).json({
          sucess: true,
    
        })
      })