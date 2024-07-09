const express = require("express");
const {
  handleCreateURL,
  handleGetURL,
  handleDeleteURL,
  handleGetAnalytics,
} = require("../controllers/url.controller");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);
router.get("/", handleGetURL);

router.post("/", handleCreateURL);

router.delete("/", handleDeleteURL);

router.get("/analytics/:id", handleGetAnalytics);

module.exports = router;
