const express = require("express");
const { body, validationResult } = require("express-validator");

const { User } = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");
const { hashPassword, verifyPassword, signAccessToken } = require("../utils/security");

const authRouter = express.Router();

function respondValidationErrors(req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return res.status(400).json({
    detail: result.array().map((e) => e.msg).join(", "),
  });
}

// ----------------------------
// USER AUTH
// ----------------------------
authRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("fullName").optional().isString().trim().notEmpty().withMessage("fullName must be non-empty"),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const { email, password, fullName } = req.body;

    const existing = await User.findOne({ email, role: "user" });
    if (existing) return res.status(409).json({ detail: "Email already in use" });

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      fullName: fullName || "",
      passwordHash,
      role: "user",
    });

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    return res.json({
      accessToken,
      user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    });
  }
);

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "user" });
    if (!user) return res.status(401).json({ detail: "Invalid credentials" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ detail: "Invalid credentials" });

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    return res.json({
      accessToken,
      user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    });
  }
);

// ----------------------------
// TEACHER AUTH
// ----------------------------
authRouter.post(
  "/teacher/register",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("fullName").optional().isString().trim().notEmpty().withMessage("fullName must be non-empty"),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const { email, password, fullName } = req.body;

    const existing = await User.findOne({ email, role: "teacher" });
    if (existing) return res.status(409).json({ detail: "Email already in use" });

    const passwordHash = await hashPassword(password);
    const teacher = await User.create({
      email,
      fullName: fullName || "",
      passwordHash,
      role: "teacher",
    });

    const accessToken = signAccessToken({ userId: teacher._id.toString(), role: teacher.role });
    return res.json({
      accessToken,
      teacher: { id: teacher._id, email: teacher.email, fullName: teacher.fullName, role: teacher.role },
    });
  }
);

authRouter.post(
  "/teacher/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isString().notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const { email, password } = req.body;

    const teacher = await User.findOne({ email, role: "teacher" });
    if (!teacher) return res.status(401).json({ detail: "Invalid credentials" });

    const ok = await verifyPassword(password, teacher.passwordHash);
    if (!ok) return res.status(401).json({ detail: "Invalid credentials" });

    const accessToken = signAccessToken({ userId: teacher._id.toString(), role: teacher.role });
    return res.json({
      accessToken,
      teacher: { id: teacher._id, email: teacher.email, fullName: teacher.fullName, role: teacher.role },
    });
  }
);

authRouter.get("/teacher/me", requireAuth, requireRole("teacher"), async (req, res) => {
  const teacher = await User.findById(req.auth.userId).select("email fullName role");
  if (!teacher) return res.status(404).json({ detail: "Teacher not found" });
  res.json({
    teacher: {
      id: teacher._id,
      email: teacher.email,
      fullName: teacher.fullName,
      role: teacher.role,
    },
  });
});

authRouter.post(
  "/teacher/change-password",
  requireAuth,
  requireRole("teacher"),
  [
    body("currentPassword").isString().notEmpty().withMessage("currentPassword is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("newPassword must be at least 6 chars"),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const teacher = await User.findById(req.auth.userId);
    if (!teacher) return res.status(404).json({ detail: "Teacher not found" });

    const ok = await verifyPassword(req.body.currentPassword, teacher.passwordHash);
    if (!ok) return res.status(401).json({ detail: "Current password is incorrect" });

    teacher.passwordHash = await hashPassword(req.body.newPassword);
    await teacher.save();
    res.json({ ok: true });
  }
);

module.exports = { authRouter };

