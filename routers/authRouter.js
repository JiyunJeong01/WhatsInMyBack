const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.loginPage);
router.get("/signup", authController.signupPage);
router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.get("/logout", authController.logout);

module.exports = router;