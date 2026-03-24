const express = require("express");
const { body, validationResult, param, query } = require("express-validator");

const { Result } = require("../models/Result");
const { User } = require("../models/User");
const { Test } = require("../models/Test");
const { requireAuth, requireRole } = require("../middleware/auth");

const resultsRouter = express.Router();

function respondValidationErrors(req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return res.status(400).json({
    detail: result.array().map((e) => e.msg).join(", "),
  });
}

// Teacher: top users by total score across tests
resultsRouter.get("/top-users", requireAuth, requireRole("teacher"), async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), 50);

  const rows = await Result.aggregate([
    {
      $group: {
        _id: "$userId",
        totalScore: { $sum: "$score" },
        attempts: { $sum: 1 },
      },
    },
    { $sort: { totalScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        totalScore: 1,
        attempts: 1,
        email: "$user.email",
        fullName: "$user.fullName",
      },
    },
  ]);

  res.json({ topUsers: rows });
});

// Teacher: list results with filters
resultsRouter.get(
  "/",
  requireAuth,
  requireRole("teacher"),
  [
    query("testId").optional().isString(),
    query("userId").optional().isString(),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const filter = {};
    if (req.query.testId) filter.testId = req.query.testId;
    if (req.query.userId) filter.userId = req.query.userId;

    const results = await Result.find(filter)
      .sort({ createdAt: -1 })
      .populate("testId", "title")
      .populate("userId", "email fullName role");

    const mapped = results.map((r) => ({
      id: r._id,
      score: r.score,
      createdAt: r.createdAt,
      test: r.testId ? { id: r.testId._id, title: r.testId.title } : null,
      user: r.userId ? { id: r.userId._id, email: r.userId.email, fullName: r.userId.fullName } : null,
    }));

    res.json({ results: mapped });
  }
);

// Optional: user submit result (for completeness)
resultsRouter.post(
  "/submit",
  requireAuth,
  requireRole("user"),
  [
    body("testId").isString().notEmpty().withMessage("testId is required"),
    body("score").isInt({ min: 0 }).withMessage("score must be >= 0"),
    body("meta").optional().isObject(),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const userId = req.auth.userId;
    const { testId, score, meta } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ detail: "Test not found" });

    const result = await Result.create({
      userId,
      testId,
      score,
      meta: meta || {},
    });

    res.status(201).json({ resultId: result._id });
  }
);

module.exports = { resultsRouter };

