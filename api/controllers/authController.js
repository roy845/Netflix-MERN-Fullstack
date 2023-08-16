const User = require("../models/User");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const {
  sendEmail,
  sendEmailResetPassword,
} = require("../middlewares/SendEmail");

module.exports = {
  registerController: async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password: await hashPassword(password),
    });

    try {
      const user = await newUser
        .save()
        .then(() => console.log("user saved successfully"))
        .catch((err) => console.log(err));

      res.status(201).send({ user: user });
      await sendEmail(
        email,
        "Welcome to Netflix site",
        `
      <p>You recently registered to our site</p>
      <p>Save your details in order to connect</p>
      <p>Have a great day!</p>
    `
      );
    } catch (error) {
      res.status(500).send({ error: error });
    }
  },

  loginController: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send({ message: "Wrong credentials" });
      }

      const match = await comparePassword(req.body.password, user.password);
      if (!match) {
        return res.status(401).send({
          message: "Unauthorized",
        });
      }

      // Set the isConnected field to true
      user.isConnected = true;
      await user.save();

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const { password, resetTokenDetails, ...userInfo } = user._doc;

      res.status(200).send({ user: userInfo, token });
    } catch (error) {
      res.status(500).send({ error: error });
    }
  },
  logoutController: async (req, res) => {
    const { uid } = req.params; // Assuming the authenticated user ID is stored in req.userId

    try {
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Set the isConnected field to false
      user.isConnected = false;
      await user.save();

      res.status(200).send({ message: "Logout successful" });
    } catch (error) {
      res.status(500).send({ error: error });
    }
  },

  getAdminDashboardController: (req, res) => {
    res.status(200).send({ ok: true });
  },

  forgotPasswordController: async (req, res) => {
    const { email } = req.body;

    // check if user exists in database
    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(400).json({ message: "User not found" });
    } else {
      // generate unique token for reset password request
      const token = crypto.randomBytes(20).toString("hex");

      // create password reset token document and save to database
      const passwordResetTokenDetails = {
        email,
        token,
        expiresAt: new Date(Date.now() + 900000), // token is valid only for 15 min from generation
      };

      user.resetTokenDetails = passwordResetTokenDetails;

      await user.save();

      try {
        await sendEmailResetPassword(email, token);
        res.json({ message: "Email sent" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending email" });
      }
    }
  },
  resetPasswordController: async (req, res) => {
    const { token, password } = req.body;

    // find user by token and check expiration time
    const user = await User.findOne({
      "resetTokenDetails.token": token,
      "resetTokenDetails.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
    } else {
      // encrypt new password using bcrypt
      const hashedPassword = await hashPassword(password);

      // update user password in database
      await User.updateOne({
        email: user.email,
        password: hashedPassword,
      });

      user.resetTokenDetails = {};
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    }
  },
};
