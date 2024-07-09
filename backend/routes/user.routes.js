const express = require("express");
const {
  handleUserLogin,
  handleUserSignup,
  handleGetUserInfo,
} = require("../controllers/user.controller");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/login", handleUserLogin);

router.post("/signup", handleUserSignup);

router.get("/userInfo", requireAuth, handleGetUserInfo);

module.exports = router;
