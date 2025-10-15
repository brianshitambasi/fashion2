const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const auth = require("../middleware/auth");

router.post("/", auth, reviewController.createReview);
router.get("/", reviewController.getReviews);
router.get("/shop/:shopId", reviewController.getReviewsByShop);
router.get("/:id", reviewController.getReviewById);
router.put("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);

module.exports = router;