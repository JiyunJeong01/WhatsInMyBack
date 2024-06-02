const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get("/", homeController.index);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> feature-board
