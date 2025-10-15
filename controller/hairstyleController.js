
const { Hairstyle, Shop } = require("../models/model");

// Create hairstyle
exports.createHairstyle = async (req, res) => {
  try {
    const { name, gender, imageUrl, tags, shop } = req.body;

    // Validate shop exists and user owns it
    const shopData = await Shop.findById(shop);
    if (!shopData) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (shopData.owner.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const hairstyle = new Hairstyle({
      name,
      gender,
      imageUrl,
      tags,
      shop
    });

    await hairstyle.save();
    await hairstyle.populate("shop", "name location");

    res.status(201).json({ message: "Hairstyle created successfully", hairstyle });
  } catch (error) {
    res.status(500).json({ message: "Error creating hairstyle", error: error.message });
  }
};

// Get all hairstyles
exports.getHairstyles = async (req, res) => {
  try {
    const hairstyles = await Hairstyle.find().populate("shop", "name location");
    res.json(hairstyles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hairstyles", error: error.message });
  }
};

// Get hairstyles by shop
exports.getHairstylesByShop = async (req, res) => {
  try {
    const hairstyles = await Hairstyle.find({ shop: req.params.shopId })
      .populate("shop", "name location");
    res.json(hairstyles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hairstyles", error: error.message });
  }
};

// Get single hairstyle
exports.getHairstyleById = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id)
      .populate("shop", "name location");
    
    if (!hairstyle) {
      return res.status(404).json({ message: "Hairstyle not found" });
    }

    res.json(hairstyle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hairstyle", error: error.message });
  }
};

// Update hairstyle
exports.updateHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id).populate("shop");
    
    if (!hairstyle) {
      return res.status(404).json({ message: "Hairstyle not found" });
    }

    // Check ownership
    if (hairstyle.shop.owner.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedHairstyle = await Hairstyle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("shop", "name location");

    res.json({ message: "Hairstyle updated successfully", hairstyle: updatedHairstyle });
  } catch (error) {
    res.status(500).json({ message: "Error updating hairstyle", error: error.message });
  }
};

// Delete hairstyle
exports.deleteHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id).populate("shop");
    
    if (!hairstyle) {
      return res.status(404).json({ message: "Hairstyle not found" });
    }

    // Check ownership
    if (hairstyle.shop.owner.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Hairstyle.findByIdAndDelete(req.params.id);
    res.json({ message: "Hairstyle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hairstyle", error: error.message });
  }
};