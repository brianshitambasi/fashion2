const { Booking, User, Shop } = require("../models/model");

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { shop, service, dateTime } = req.body;

    const booking = new Booking({
      customer: req.user.userId,
      shop,
      service,
      dateTime
    });

    await booking.save();
    await booking.populate("customer", "name email");
    await booking.populate("shop", "name location");

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get all bookings (for admin or shop owner)
exports.getBookings = async (req, res) => {
  try {
    let bookings;
    
    if (req.user.role === "admin") {
      bookings = await Booking.find()
        .populate("customer", "name email")
        .populate("shop", "name location")
        .populate("payment");
    } else if (req.user.role === "shop") {
      // Get shops owned by user
      const userShops = await Shop.find({ owner: req.user.userId });
      const shopIds = userShops.map(shop => shop._id);
      
      bookings = await Booking.find({ shop: { $in: shopIds } })
        .populate("customer", "name email")
        .populate("shop", "name location")
        .populate("payment");
    } else {
      // Customer sees only their bookings
      bookings = await Booking.find({ customer: req.user.userId })
        .populate("customer", "name email")
        .populate("shop", "name location")
        .populate("payment");
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email")
      .populate("shop", "name location")
      .populate("payment");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    if (req.user.role === "customer" && booking.customer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

// Update booking status
exports.updateBooking = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate("shop");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization (shop owner or admin)
    if (req.user.role === "customer" && booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.user.role === "shop" && booking.shop.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only customer who created booking or admin can delete
    if (booking.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};