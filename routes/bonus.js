const express = require('express');
const { getBonusAmount, editBonusAmount, createBonusAmount } = require('../controllers/bonusController');

const router = express.Router();

router.route('/bonus/create').post(createBonusAmount);
router.route('/bonus/edit/:id').put(editBonusAmount);
router.route('/bonus/get').get(getBonusAmount);


// router.route('/fetch_chat').get(fetchChats);

module.exports = router