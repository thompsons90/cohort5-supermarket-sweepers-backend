const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/api', require('./groceryItems'));

module.exports = router;
