const express = require('express');
const router = express.Router();
const { getGroceryItems } = require('../controllers/groceryItems');

router.route('/groceryitems').get(getGroceryItems);

module.exports = router;
