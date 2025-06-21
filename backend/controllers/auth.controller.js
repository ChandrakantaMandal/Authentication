import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "All Fields are Required" });
    }
    
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 Hour,
    });
    await user.save();
    
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Verification Code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
    
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    generateTokenAndSetCookie(res, user._id);
    
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout Successful" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }
    
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpireAt;
    await user.save();

    console.log(`Development: Password reset URL - ${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    try {
      await sendPasswordResetEmail(
        user.email,
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`
      );
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent."
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "An error occurred while processing your request" 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or Expired Reset Token" });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password Reset Successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkauth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
