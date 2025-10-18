const express = require("express");
const router = express.Router();

console.log("Loading review routes...");
<<<<<<< HEAD
const reviewController = require("../controller/reviewController");
const {auth} = require("../middleware/auth");
=======

try {
    const reviewController = require("../controller/reviewController");
    const auth = require("../middleware/auth");
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    
    console.log("Review controller loaded successfully");
    
    router.post("/", auth, reviewController.createReview);
    router.get("/", reviewController.getReviews);
    router.get("/shop/:shopId", reviewController.getReviewsByShop);
    router.get("/:id", reviewController.getReviewById);
    router.put("/:id", auth, reviewController.updateReview);
    router.delete("/:id", auth, reviewController.deleteReview);
<<<<<<< HEAD
=======
    
} catch (error) {
    console.error("ERROR loading review routes:", error.message);
}
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794

module.exports = router;