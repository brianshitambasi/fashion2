const express = require("express");
const router = express.Router();

// Add debug logging
console.log("Loading booking routes...");

try {
    const bookingController = require("../controller/bookingController");
    const auth = require("../middleware/auth");
    
    console.log("Booking controller loaded successfully");
    
    router.post("/", auth, bookingController.createBooking);
    router.get("/", auth, bookingController.getBookings);
    router.get("/:id", auth, bookingController.getBookingById);
    router.put("/:id", auth, bookingController.updateBooking);
    router.delete("/:id", auth, bookingController.deleteBooking);
    
} catch (error) {
    console.error("ERROR loading booking routes:", error.message);
}

module.exports = router;