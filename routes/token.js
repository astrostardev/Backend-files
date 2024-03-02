const express = require('express')
const { tokenRefresh } = require('../controllers/jwtTokenRefresh')
const router = express.Router()
 router.route('/refresh_token').post(tokenRefresh)
 module.exports = router