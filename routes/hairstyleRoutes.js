const express = require("express");
const router = express.Router();

console.log("Loading hairstyle routes...");

try {
    const hairstyleController = require("../controller/hairstyleController");
    const auth = require("../middleware/auth");
    
    console.log("Hairstyle controller loaded successfully");
    
    router.get("/", hairstyleController.getHairstyles);
    router.get("/shop/:shopId", hairstyleController.getHairstylesByShop);
    router.get("/:id", hairstyleController.getHairstyleById);
    router.post("/", auth, hairstyleController.createHairstyle);
    router.put("/:id", auth, hairstyleController.updateHairstyle);
    router.delete("/:id", auth, hairstyleController.deleteHairstyle);
    
} catch (error) {
    console.error("ERROR loading hairstyle routes:", error.message);
}

module.exports = router;