const express = require('express')
const {  getastrologerMessages, getUserMessages, sendMessageToUser, sendMessageToAstrologer, getAstrolatestMessages, getUserlatestMessages } = require('../controllers/messageController')
const router = express.Router()
const Client = require('../models/clientModel')
const {verification, astrologerVerification} = require('../middlewares/authenticate.js')
const Astrologer = require('../models/astrologerModel.js')

router.route('/user_messages/:id').get(verification(Client,'clientId'), getUserMessages)
router.route('/latest_user_messages/:id').get(verification(Client,'clientId'), getUserlatestMessages)

 router.route('/astro_messages/:id').get(astrologerVerification, getastrologerMessages)
 router.route('/latest_astro_message/:id').get(astrologerVerification, getAstrolatestMessages)


router.route('/message/send/astrologer/:id').post(verification(Client,'clientId'), sendMessageToAstrologer)
router.route('/message/send/user/:id').post(astrologerVerification, sendMessageToUser)

 
module.exports = router