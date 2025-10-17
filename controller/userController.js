const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/model");

// ========================
// Register User
// ========================
exports.registerUser = async (req, res) => {
  try {
    console.log("🔐 Registration attempt:", req.body);
    
    let { name, email, password, phone, role, profileImage } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Normalize role
    role = role ? role.toLowerCase() : "customer";

    // Validate role
    const validRoles = ["customer", "shop", "admin"];
    if (!validRoles.includes(role)) {
      console.log("❌ Invalid role:", role);
      return res.status(400).json({ 
        message: "Invalid role. Must be: customer, shop, or admin" 
      });
    }

    console.log("🔍 Checking for existing user...");
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already exists:", email);
      return res.status(400).json({ 
        message: "Email already exists" 
      });
    }

    console.log("🔒 Hashing password...");
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("👤 Creating user...");
    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      profileImage,
    });

    await newUser.save();
    console.log("✅ User saved successfully:", newUser._id);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
    });
  } catch (error) {
    console.error("❌ ERROR in registerUser:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Server error during registration" 
    });
  }
};

// ========================
// Login User
// ========================
exports.loginUser = async (req, res) => {
  try {
    console.log("🔐 Login attempt:", req.body);
    
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    console.log("🔍 Finding user...");
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    console.log("🔑 Comparing passwords...");
    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log("❌ Invalid password for user:", email);
      return res.status(400).json({ 
        message: "Invalid password" 
      });
    }

    console.log("🎫 Generating JWT token...");
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email 
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "12h" }
    );

    console.log("✅ Login successful for:", email);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("❌ ERROR in loginUser:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Server error during login" 
    });
  }
};