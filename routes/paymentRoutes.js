const express = require("express");
const router = express.Router();

console.log("Loading payment routes...");
const paymentController = require("../controller/paymentController");
const {auth} = require("../middleware/auth");
    
    console.log("Payment controller loaded successfully");
    
    router.post("/", auth, paymentController.createPayment);
    router.get("/", auth, paymentController.getPayments);
    router.get("/:id", auth, paymentController.getPaymentById);
    router.put("/:id", auth, paymentController.updatePayment);
    router.delete("/:id", auth, paymentController.deletePayment);

module.exports = router;