const express = require('express')
const{registerAdmin, loginAdmin, logoutAdmin} = require('../controllers/adminController')
const router = express.Router()

router.route('/admin/register').post(registerAdmin)
router.route('/admin/login').post(loginAdmin);
router.route('/admin/logout').get(logoutAdmin);


module.exports = router