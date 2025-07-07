// routes/userRouter.js
const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");

router.get("/", UserController.test);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/loggedIn", UserController.loggedIn);
router.post("/updateuser", UserController.updateUser);

module.exports = router;