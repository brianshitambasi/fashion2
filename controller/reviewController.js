const { Review, Shop } = require("../models/model");

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

exports.createReview = async (req, res) => {
  try {
    const { shop, rating, comment } = req.body;
    const shopExists = await Shop.findById(shop);
    if (!shopExists) return res.status(404).json({ message: "Shop not found" });
    const review = new Review({ customer: req.user.userId, shop, rating, comment });
    await review.save();
    await updateShopRating(shop);
    await review.populate("customer", "name email");
    await review.populate("shop", "name location");
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("customer", "name email").populate("shop", "name location");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.getReviewsByShop = async (req, res) => {
  try {
    const reviews = await Review.find({ shop: req.params.shopId }).populate("customer", "name email").populate("shop", "name location");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("customer", "name email").populate("shop", "name location");
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("customer", "name email").populate("shop", "name location");
    await updateShopRating(updatedReview.shop);
    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const shopId = review.shop;
    await Review.findByIdAndDelete(req.params.id);
    await updateShopRating(shopId);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};