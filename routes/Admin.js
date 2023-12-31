const express = require('express')
const{registerAdmin, loginAdmin, logoutAdmin} = require('../controllers/adminController')
const router = express.Router()
const jwt = require('jsonwebtoken')



const verification = async(req, res, next)=>{
    try{
      let token = req.header("Authorization")
      if(token && token.startsWith("Bearer ")){
        token = token.slice(7,token.length).trimLeft();
        const verified = jwt.verify(token,process.env.JWT_SECRET)
        req.user = verified
        console.log('verification',verified);
        next()
      }
      else{
        res.status(403).send("Access denied")
      }
    }catch(err){
       res.status(400).json({msg:err.message})
    }
  }
router.route('/admin/register').post(registerAdmin)
router.route('/admin/login').post(loginAdmin);
router.route('/admin/logout').get(verification,logoutAdmin);


module.exports = router