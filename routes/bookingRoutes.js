// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const {auth} = require("../middleware/auth");

console.log("✅ Booking routes loaded");

router.post("/", auth, bookingController.createBooking);
router.get("/", auth, bookingController.getBookings);
router.get("/:id", auth, bookingController.getBookingById);
router.put("/:id", auth, bookingController.updateBooking);
router.delete("/:id", auth, bookingController.deleteBooking);

module.exports = router;
