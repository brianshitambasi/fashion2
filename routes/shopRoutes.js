const express = require("express");
const router = express.Router();

console.log("Loading shop routes...");
<<<<<<< HEAD
 const shopController = require("../controller/shopController");
const {auth} = require("../middleware/auth");
=======

try {
    const shopController = require("../controller/shopController");
    const auth = require("../middleware/auth");
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794
    
    console.log("Shop controller loaded successfully");
    
    router.post("/", auth, shopController.createShop);
    router.get("/", shopController.getShops);
    router.get("/:id", shopController.getShopById);
    router.put("/:id", auth, shopController.updateShop);
    router.delete("/:id", auth, shopController.deleteShop);
<<<<<<< HEAD

=======
    
} catch (error) {
    console.error("ERROR loading shop routes:", error.message);
}
>>>>>>> 26307b26190ecdbb0abe253db5a7037a53308794

module.exports = router;