const { Review, User, Shop } = require("../models/model");

// Create review
exports.createReview = async (req, res) => {
  try {
    const { shop, rating, comment } = req.body;

    // Check if shop exists
    const shopExists = await Shop.findById(shop);
    if (!shopExists) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const review = new Review({
      customer: req.user.userId,
      shop,
      rating,
      comment
    });

    await review.save();
    
    // Update shop rating
    await updateShopRating(shop);

    await review.populate("customer", "name email");
    await review.populate("shop", "name location");

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("customer", "name email")
      .populate("shop", "name location");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// Get reviews by shop
exports.getReviewsByShop = async (req, res) => {
  try {
    const reviews = await Review.find({ shop: req.params.shopId })
      .populate("customer", "name email")
      .populate("shop", "name location");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// Get single review
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("customer", "name email")
      .populate("shop", "name location");
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only review author can update
    if (review.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate("customer", "name email")
    .populate("shop", "name location");

    // Update shop rating
    await updateShopRating(updatedReview.shop);

    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only review author or admin can delete
    if (review.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const shopId = review.shop;
    await Review.findByIdAndDelete(req.params.id);

    // Update shop rating
    await updateShopRating(shopId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};

// Helper function to update shop rating
async function updateShopRating(shopId) {
  const reviews = await Review.find({ shop: shopId });
  
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Shop.findByIdAndUpdate(shopId, { rating: parseFloat(averageRating.toFixed(1)) });
  } else {
    await Shop.findByIdAndUpdate(shopId, { rating: 0 });
  }
}