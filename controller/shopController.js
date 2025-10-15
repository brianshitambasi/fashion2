const { Shop, User } = require("../models/model");

// Create shop
exports.createShop = async (req, res) => {
  try {
    const { name, location, description, services } = req.body;

    const shop = new Shop({
      owner: req.user.userId,
      name,
      location,
      description,
      services
    });

    await shop.save();
    await shop.populate("owner", "name email");

    res.status(201).json({ message: "Shop created successfully", shop });
  } catch (error) {
    res.json({ message: "Error creating shop", error: error.message });
  }
};

// Get all shops
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate("owner", "name email")
      .populate("reviews");
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shops", error: error.message });
  }
};

// Get single shop
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate("owner", "name email")
      .populate("reviews");
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop", error: error.message });
  }
};

// Update shop
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Check ownership
    if (shop.owner.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("owner", "name email");

    res.json({ message: "Shop updated successfully", shop: updatedShop });
  } catch (error) {
    res.status(500).json({ message: "Error updating shop", error: error.message });
  }
};

// Delete shop
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Check ownership
    if (shop.owner.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shop", error: error.message });
  }
};