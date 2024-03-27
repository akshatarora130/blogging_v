const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers");
const BlogController = require("../controllers/blogControllers");

router.get("/", UserController.checkIsLoggedIn, UserController.renderHome);
router.get("/login",UserController.renderLogin);
router.get("/register",UserController.renderRegister);

router.post("/register", UserController.registerUser);
router.get("/verify/:id/:token", UserController.verifyUser);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logoutUser);

module.exports = router;
