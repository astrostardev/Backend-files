const express = require('express')
const {  getastrologerMessages, getUserMessages, sendMessageToUser, sendMessageToAstrologer, getAstrolatestMessages, getUserlatestMessages, uploadAudioFile } = require('../controllers/messageController')
const router = express.Router()
const Client = require('../models/clientModel')
const {verification, astrologerVerification} = require('../middlewares/authenticate.js')
const Astrologer = require('../models/astrologerModel.js')
const multer = require("multer");
const path = require("path");

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads/messages/audioMessage"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
const upload = multer({ storage: storage });



router.route('/user_messages/:id').get(verification(Client,'clientId'), getUserMessages)
router.route('/latest_user_messages/:id').get(verification(Client,'clientId'), getUserlatestMessages)

 router.route('/astro_messages/:id').get(astrologerVerification, getastrologerMessages)
 router.route('/latest_astro_message/:id').get(astrologerVerification, getAstrolatestMessages)


router.route('/message/send/astrologer/:id').post(verification(Client,'clientId'), sendMessageToAstrologer)
router.route('/message/send/user/:id').post(astrologerVerification, sendMessageToUser)
router.route('/message/send/audio').post(upload.single("audio"),uploadAudioFile)

 
module.exports = router