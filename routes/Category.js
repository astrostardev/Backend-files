const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createCategory, showCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')

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
router.route('/category/create').post(createCategory)
router.route('/category/show').get(showCategories)
router.route('/category/get/:id').get(getCategory)
router.route('/category/update/:id').put(updateCategory)
router.route('/category/delete/:id').delete(deleteCategory)


module.exports = router