const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

module.exports = router;