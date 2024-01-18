const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createCourse, showCourses, getCourse, deleteCourse, updateCourse } = require('../controllers/courseController')
const multer = require('multer');
const path = require('path');

const verification = async(req, res, next)=>{
    try{
      let token = req.header("Authorization")
      if(token && token.startsWith("Bearer ")){
        token = token.slice(7,token.length).trimLeft();
        const verified = jwt.verify(token,process.env.JWT_SECRET)
        req.user = verified
        console.log(verified);
        next()
      }
      else{
        res.status(403).send("Access denied")
      }
    }catch(err){
       res.status(400).json({msg:err.message})
    }
  }
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        console.log('Destination Path:', path.join(__dirname, '..', 'uploads', 'courseImages'));
        cb(null, path.join(__dirname, '..', 'uploads', 'courseImages'));
      },
      filename: function (req, file, cb) {
        const timestamp = Date.now();
        console.log('Uploading File:', file.originalname);
        cb(null, `${file.originalname}`);
      },
    }),
  });
    
router.route('/course/create').post( upload.array('images'),createCourse)
router.route('/course/show').get(showCourses)
router.route('/course/get/:id').get(getCourse)
router.route('/course/update/:id').put(upload.array('images'),updateCourse)
router.route('/course/delete/:id').delete(deleteCourse)


module.exports = router