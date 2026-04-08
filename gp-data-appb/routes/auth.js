const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/User");

const SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // ✅ Validation
    if (!name || !email || !password || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user exists
    findUserByEmail(email, async (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ 
          message: "User already exists with this email ❌" 
        });
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create user
      createUser(
        {
          name,
          email,
          password: hashedPassword,
          contact,
        },
        (err, result) => {
          if (err) {
            console.error("DB Insert Error:", err);
            return res.status(500).json({ message: "Error creating user" });
          }

          res.json({ message: "User registered successfully ✅" });
        }
      );
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and Password are required" 
      });
    }

    // ✅ Find user
    findUserByEmail(email, async (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // ❌ Incorrect Email
      if (result.length === 0) {
        return res.status(400).json({ 
          message: "Incorrect email ❌" 
        });
      }

      const user = result[0];

      // ❌ Incorrect Password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ 
          message: "Incorrect password ❌" 
        });
      }

      // ✅ Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: "1d" }
      );

      // ✅ Remove password
      const { password: _, ...safeUser } = user;

      res.json({
        message: "Login successful ✅",
        token,
        user: safeUser,
      });
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;