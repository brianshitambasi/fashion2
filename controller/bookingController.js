<<<<<<< HEAD
<<<<<<< HEAD
// controllers/bookingController.js
const { Booking, Shop } = require("../models/model");

// ✅ Create a booking
=======
const { Booking, Shop } = require("../models/model");

>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
const { Booking, Shop } = require("../models/model");

>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
exports.createBooking = async (req, res) => {
  try {
    const { shop, service, dateTime } = req.body;
    const booking = new Booking({ customer: req.user.userId, shop, service, dateTime });
    await booking.save();
    await booking.populate("customer", "name email");
    await booking.populate("shop", "name location");
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
// ✅ Get all bookings
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "admin") {
<<<<<<< HEAD
<<<<<<< HEAD
      bookings = await Booking.find()
        .populate("customer", "name email")
        .populate("shop", "name location")
        .populate("payment");
    } else if (req.user.role === "shop") {
      const userShops = await Shop.find({ owner: req.user.userId });
      const shopIds = userShops.map((shop) => shop._id);
      bookings = await Booking.find({ shop: { $in: shopIds } })
        .populate("customer", "name email")
        .populate("shop", "name location")
        .populate("payment");
    } else {
      bookings = await Booking.find({ customer: req.user.userId })
        .populate("customer", "name email")
        .populate("shop", "name location")
        .populate("payment");
=======
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
      bookings = await Booking.find().populate("customer", "name email").populate("shop", "name location").populate("payment");
    } else if (req.user.role === "shop") {
      const userShops = await Shop.find({ owner: req.user.userId });
      const shopIds = userShops.map(shop => shop._id);
      bookings = await Booking.find({ shop: { $in: shopIds } }).populate("customer", "name email").populate("shop", "name location").populate("payment");
    } else {
      bookings = await Booking.find({ customer: req.user.userId }).populate("customer", "name email").populate("shop", "name location").populate("payment");
<<<<<<< HEAD
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
// ✅ Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email")
      .populate("shop", "name location")
      .populate("payment");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role === "customer" && booking.customer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

=======
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("customer", "name email").populate("shop", "name location").populate("payment");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (req.user.role === "customer" && booking.customer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
<<<<<<< HEAD
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
// ✅ Update booking
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
exports.updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate("shop");
<<<<<<< HEAD
<<<<<<< HEAD

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role === "customer" && booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.user.role === "shop" && booking.shop.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

=======
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (req.user.role === "customer" && booking.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (req.user.role === "shop" && booking.shop.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
<<<<<<< HEAD
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    booking.status = status;
    await booking.save();
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
// ✅ Delete booking
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
<<<<<<< HEAD
<<<<<<< HEAD

    if (booking.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

=======
    if (booking.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
    if (booking.customer.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
<<<<<<< HEAD
<<<<<<< HEAD
};
=======
};
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
=======
};
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
