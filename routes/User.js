const express = require('express');
const multer = require('multer')
const jwt = require('jsonwebtoken')

const {registerUser, getAllUser, updateUser, deleteUser, loginUser, getUserPhone, getUser, userCall, logoutUser, rechargePackage, getRechargedPackage, createUserProfile, searchUserByRefCode, sortUserByBonus} = require('../controllers/userController')
const router = express.Router();

const upload = multer({storage:multer.diskStorage({
    desitination:function(req,file,cb){
        cb(null, path.join(__dirname,'..','uploads/user'))
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})

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
router.route('/user/register').post(registerUser)
router.route('/user/login').post(loginUser)
router.route('/user/getuser/:id').get(getUser)
router.route('/user/by_ref_code').get(searchUserByRefCode)
router.route('/user/bonus').get(sortUserByBonus)
router.route('/user/recharge/:id').post(getRechargedPackage)
router.route('/user/logout').get(logoutUser)
// router.route("/user/phoneNo").get(verification,getUserPhone)
router.route('/user/users').get(getAllUser)
router.route('/user/callDuration').post(verification,userCall)
router.route('/user/create/:id').post(verification,createUserProfile)
router.route('/user/delete/:id').delete(verification,deleteUser)
module.exports = router;