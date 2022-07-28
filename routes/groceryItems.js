const express = require('express');
const router = express.Router();
const { getGroceryItems, getMeatDataCollectionFromFirestore, getWalmartCollectionFromFirestore, getKrogerCollectionFromFirestore } = require('../controllers/groceryItems');

// router.route('/groceryitems').get(getGroceryItems);
router.route('/meatData').get(getMeatDataCollectionFromFirestore)
router.route('/walmartData').get(getWalmartCollectionFromFirestore)
router.route('/krogerData').get(getKrogerCollectionFromFirestore)

module.exports = router;