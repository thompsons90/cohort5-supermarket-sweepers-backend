const express = require('express');
const router = express.Router();
const { testApiConnection } = require('../controllers/api');

router.route('/heartbeat').get(testApiConnection);

module.exports = router;
