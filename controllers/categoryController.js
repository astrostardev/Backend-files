const catchAsyncError = require('../middlewares/catchAsyncError')
const Category = require('../models/categoryModel')

exports.createCategory = catchAsyncError( async (req, res, next) => {
  try {
      const { name } = req.body.category;
      const existingCategory = await Category.findOne({ 'category.name': name });

      if (existingCategory) {
          return res.status(400).json({ error: 'Category already exists' });
      }

      const categories = await Category.create(req.body);
      res.status(200).json({
        success: true,
        categories
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


exports.showCategories = catchAsyncError(async(req,res,next)=>{
    const categories = await Category.find();
  
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
    res.status(200).json({
        success: true,
        categories
    }); 
    }) 
    exports.getCategory = catchAsyncError(async(req,res,next)=>{
      const category = await Category.findById(req.params.id);
    
      // Set Content-Type to application/json
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
      res.status(200).json({
          success: true,
          category
      }); 
      }) 
      exports.updateCategory = catchAsyncError(async(req,res,next)=>{
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
    exports.deleteCategory= catchAsyncError(async (req, res, next) => {
      const category= await  Category.findById(req.params.id);
  
      await category.deleteOne();
      res.status(200).json({
        sucess: true,
  
      })
    })