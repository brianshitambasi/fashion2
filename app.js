// entry file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// static file accessibility
// app.use("/uploads",express.static("uploads"))

// Routes - ONLY KEEP THIS SET
//user routes
const userRoutes=require('./routes/userRoutes')
app.use('/user',userRoutes)

// booking routes
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/booking", bookingRoutes);

// hairstyle
const hairstyleRoutes = require("./routes/hairstyleRoutes");
app.use("/hairstyle", hairstyleRoutes);

// payment routes
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payment", paymentRoutes);

// review routes
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/review", reviewRoutes);

// shoproutes
const shopRoutes= require("./routes/shopRoutes");
app.use("/shop", shopRoutes); // Changed from "/shopRoutes" to "/shop"

// connection to the database
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch(err=>console.log("mongodb connection error",err))

const PORT=process.env.PORT || 3002
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})