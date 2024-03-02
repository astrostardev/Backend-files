const express = require('express');
const multer = require('multer')
const jwt = require('jsonwebtoken')

const {registerUser, getAllUser, updateUser, deleteUser, loginUser, getUserPhone, getUser, userCall, logoutUser, rechargePackage, getRechargedPackage, createUserProfile, searchUserByRefCode, sortUserByBonus, referralBonusForUser, getUserId} = require('../controllers/userController');
const {verification} = require('../middlewares/authenticate.js');
const Client = require('../models/clientModel');
const router = express.Router();

const upload = multer({storage:multer.diskStorage({
    desitination:function(req,file,cb){
        cb(null, path.join(__dirname,'..','uploads/user'))
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})

// 
router.route('/user/register').post(registerUser)
router.route('/user/login').post(loginUser)
router.route('/user/getuser/:id').get(getUser)
router.route('/user/getuser').post(getUserId)

router.route('/user/by_ref_code').get(searchUserByRefCode)
router.route('/user/bonus').get(sortUserByBonus)
router.route('/user/referral_bonus').get(referralBonusForUser)

router.route('/user/recharge/:id').post(getRechargedPackage)
router.route('/user/logout').get(logoutUser)
// router.route("/user/phoneNo").get(verification,getUserPhone)
router.route('/user/users').get(getAllUser)
router.route('/user/callDuration').post(verification,userCall)
router.route('/user/create/:id').post(verification,createUserProfile)
router.route('/user/delete/:id').delete(verification,deleteUser)
module.exports = router;