const express = require('express');
const multer = require('multer')
const {registerUser, getAllUser, updateUser, deleteUser, loginUser, getUserPhone, getUser, userCall, logoutUser} = require('../controllers/userController')
const router = express.Router();

const upload = multer({storage:multer.diskStorage({
    desitination:function(req,file,cb){
        cb(null, path.join(__dirname,'..','uploads/user'))
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})})


router.route('/user/register').post(registerUser)
router.route('/user/login').post(loginUser)
router.route('/user/getuser/:id').get(getUser)
router.route('/user/logout').get(logoutUser)
// router.route("/user/phoneNo").get(getUserPhone)
router.route('/user/users').get(getAllUser)
router.route('/user/callDuration').post(userCall)

router.route('/user/update/:id').patch(updateUser)
router.route('/user/delete/:id').delete(deleteUser)
module.exports = router;