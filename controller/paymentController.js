const { Payment, Booking } = require("../models/model");

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { booking, amount, method, transactionRef } = req.body;

    // Check if booking exists
    const bookingExists = await Booking.findById(booking);
    if (!bookingExists) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const payment = new Payment({
      booking,
      amount,
      method,
      transactionRef
    });

    await payment.save();

    // Update booking with payment reference
    await Booking.findByIdAndUpdate(booking, { payment: payment._id });

    await payment.populate("booking");

    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("booking")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

// Get single payment
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error: error.message });
  }
};

// Update payment status
exports.updatePayment = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("booking");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment updated successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error: error.message });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error: error.message });
  }
};