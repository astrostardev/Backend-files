const express = require('express')
const { createPackages, showPackages, updatePackages, getPackage,deletePackages} = require('../controllers/packageController')
const router = express.Router()
const jwt = require('jsonwebtoken')

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
router.route('/package/create').post(createPackages)
router.route('/package/show').get(showPackages)
router.route('/package/getPackage/:id').get(getPackage)
router.route('/package/update/:id').patch(updatePackages)
router.route('/package/delete/:id').delete(deletePackages)


module.exports = router