const mongoose = require("mongoose");

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // store hashed password
    phone: { type: String },
    role: {
      type: String,
      enum: ["customer", "shop", "admin"],
      default: "customer",
    },
    profileImage: { type: String }, // optional, hosted on Cloudinary
  },
  { timestamps: true }
);

// ================= SHOP SCHEMA =================
const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    services: [
      {
        serviceName: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

// ================= HAIRSTYLE SCHEMA =================
const hairstyleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "unisex"], required: true },
    imageUrl: { type: String, required: true }, // stored in Cloudinary
    tags: [{ type: String }], // e.g. ["fade", "braids", "short"]
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
  },
  { timestamps: true }
);

// ================= BOOKING SCHEMA =================
const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    service: {
      serviceName: { type: String, required: true },
      price: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    dateTime: { type: Date, required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

// ================= PAYMENT SCHEMA =================
const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true }, // 5%
    shopEarning: { type: Number, required: true },
    method: { type: String, enum: ["mpesa", "card"], required: true },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    transactionRef: { type: String, required: true },
  },
  { timestamps: true }
);

// Auto-calculate 5% commission before saving
paymentSchema.pre("save", function (next) {
  const commissionRate = 0.05;
  this.commission = this.amount * commissionRate;
  this.shopEarning = this.amount - this.commission;
  next();
});

// ================= REVIEW SCHEMA =================
const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// ================= MODELS =================
const User = mongoose.model("User", userSchema);
const Shop = mongoose.model("Shop", shopSchema);
const Hairstyle = mongoose.model("Hairstyle", hairstyleSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Review = mongoose.model("Review", reviewSchema);

// ================= EXPORT =================
module.exports = {
  User,
  Shop,
  Hairstyle,
  Booking,
  Payment,
  Review,
};
