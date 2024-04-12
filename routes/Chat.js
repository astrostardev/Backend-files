const express = require('express');
const { fetchChats, recentChat } = require('../controllers/chatController');

const router = express.Router();

router.route('/fetch_chat').post(fetchChats);


module.exports = router
