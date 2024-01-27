const catchAsyncError = require('../middlewares/catchAsyncError')
const Language = require('../models/languageModel')

exports.createLanguage = async (req, res, next) => {
    try {
      let BASE_URL = process.env.BACKEND_URL;
  
      if (process.env.NODE_ENV === 'production') {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
      }
      const languageName = req.body.language.name
      const existingLanguage = await Language.findOne({
        'language.name': { $regex: new RegExp(languageName, 'i') }
      });
      
      
      if (existingLanguage) {
        // Category already exists
        return res.status(409).json({
          success: false,
          message: 'language already exist',
        });
      }
  
  
      // If Clientdoesn't exist, create a new user
      const language = await Language.create(req.body);
      console.log(req.body);
      const date = new Date().toString()
      language.date = date
      language.save()

      res.status(200).json({
        success: true,
        language,
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


exports.showLanguage = catchAsyncError(async(req,res,next)=>{
    const languages = await Language.find();
  
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
    res.status(200).json({
        success: true,
        languages
    }); 
    }) 

exports.getLanguage = catchAsyncError(async(req,res,next)=>{
  const language = await Language.findById(req.params.id);

  // Set Content-Type to application/json
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  res.status(200).json({
      success: true,
      language
  }); 
  }) 

  exports.updateLanguage = catchAsyncError(async(req,res,next)=>{
    const{language} = req.body
    console.log('hi', language.language[0].name);
const languageName = language.language[0].name
    const existingCategory = await Language.findOne({
      'language.name': { $regex: new RegExp(languageName, 'i') }
    });
   if (existingCategory) {
     // Category already exists
     return res.status(409).json({
       success: false,
       message: 'Category already registered',
     });
   }
      const upcategory = await Language.findByIdAndUpdate(req.params.id,language,{
       new:true,
       runValidators: true,
     })
   
     res.status(200).json({
       success:true,
       upcategory
      }) 
 })
 


    exports.deleteLanguage= catchAsyncError(async (req, res, next) => {
        const language = await  Language.findById(req.params.id);
    
        await language.deleteOne();
        res.status(200).json({
          sucess: true,
    
        })
      })