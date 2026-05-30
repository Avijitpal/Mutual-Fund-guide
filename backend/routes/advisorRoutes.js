const express = require("express");
const router = express.Router();
const { getAIRecommendation } = require("../controllers/advisorController");
const { protect } = require("../middleware/authMiddleware"); // Optional: if you want logged-in users only

router.post("/recommend", getAIRecommendation);

module.exports = router;