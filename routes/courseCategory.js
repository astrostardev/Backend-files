const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createCourseCategory, showCoursesCategory, getCourseCategory, updateCourseCategory, deleteCourseCategory } = require('../controllers/courseCategoryController')

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
router.route('/course_category/create').post(createCourseCategory)
router.route('/course_category/show').get(showCoursesCategory)
router.route('/course_category/get/:id').get(getCourseCategory)
router.route('/course_category/update/:id').put(updateCourseCategory)
router.route('/course_category/delete/:id').delete(deleteCourseCategory)


module.exports = router