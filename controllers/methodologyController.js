const catchAsyncError = require('../middlewares/catchAsyncError')
const Methodology = require('../models/methodologyModel')

exports.createCategory = async (req, res, next) => {
    try {
      let BASE_URL = process.env.BACKEND_URL;
  
      if (process.env.NODE_ENV === 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
      }
      const categoryName = req.body.category.name
      const existingCategory = await Methodology.findOne({
        'language.name': { $regex: new RegExp(categoryName, 'i') }
      });
   
      
      if (existingCategory) {
        // Category already exists
        return res.status(409).json({
          success: false,
          message: 'Category already registered',
        });
      }
  
  
      // If Clientdoesn't exist, create a new user
      const category= await Methodology.create(req.body);
      console.log(req.body);
      const date = new Date().toString()
      category.date = date
      category.save()

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


exports.showCategory = catchAsyncError(async(req,res,next)=>{
    const categories = await Methodology.find();
  
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
    res.status(200).json({
        success: true,
        categories
    }); 
    }) 
    exports.getCategory = catchAsyncError(async(req,res,next)=>{
      const category = await Methodology.findById(req.params.id);
    
      // Set Content-Type to application/json
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
      res.status(200).json({
          success: true,
          category
      }); 
      }) 
      exports.updateCategory = catchAsyncError(async (req, res, next) => {
        const { category } = req.body;
        const categoryName = category.category[0].name;
    
        // Check if the category with the given name (case-insensitive) already exists
        const existingCategory = await Methodology.findOne({
            'category.name': { $regex: new RegExp(categoryName, 'i') }
        });
    
        if (existingCategory) {
            // Category already exists
            return res.status(409).json({
                success: false,
                message: 'Category already registered',
            });
        }
    
        // If category doesn't exist, proceed with the update
        const upcategory = await Methodology.findByIdAndUpdate(req.params.id, category, {
            new: true,
            runValidators: true,
        });
    
        res.status(200).json({
            success: true,
            upcategory
        });
    });
    
     
    exports.deleteCategory= catchAsyncError(async (req, res, next) => {
        const category = await  Methodology.findById(req.params.id);
    
        await category.deleteOne();
        res.status(200).json({
          sucess: true,
    
        })
      })