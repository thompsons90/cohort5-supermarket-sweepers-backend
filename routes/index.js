const router = require('express').Router();

router.use('/api', require('./api'));
router.use('/api/groceryitems', require('./groceryItems'));

module.exports = router;
