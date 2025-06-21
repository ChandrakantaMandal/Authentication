import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkauth,
} from "../controllers/auth.controller.js";
import { varifiyToken } from "../middleware/varifiyToken.js";

const router = express.Router();

// Fix the route definition - there was a typo here
router.get("/check-auth", varifiyToken, checkauth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Add a test route to check if cookies are being received
router.get("/test-cookies", (req, res) => {
  console.log("Cookies in test route:", req.cookies);
  res.json({ 
    cookiesReceived: !!req.cookies.token,
    cookies: req.cookies 
  });
});

export default router;
