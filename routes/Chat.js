const express = require('express');
const { accessChat, fetchChats } = require('../controllers/chatController');

const router = express.Router();

router.route('/access_chat').post(accessChat);
router.route('/fetch_chat').get(fetchChats);

module.exports = router
