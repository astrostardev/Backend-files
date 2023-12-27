const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { createCategory, showCategory, updateCategory, deleteCategory, getCategory } = require('../controllers/methodologyController')

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
router.route('/method/create').post(createCategory)
router.route('/method/show').get(showCategory)
router.route('/method/get/:id').get(getCategory)
router.route('/method/update/:id').put(updateCategory)
router.route('/method/delete/:id').delete(deleteCategory)


module.exports = router