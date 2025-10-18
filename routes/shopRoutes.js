const express = require("express");
const router = express.Router();

console.log("Loading shop routes...");
 const shopController = require("../controller/shopController");
const {auth} = require("../middleware/auth");
    
    console.log("Shop controller loaded successfully");
    
    router.post("/", auth, shopController.createShop);
    router.get("/", shopController.getShops);
    router.get("/:id", shopController.getShopById);
    router.put("/:id", auth, shopController.updateShop);
    router.delete("/:id", auth, shopController.deleteShop);


module.exports = router;