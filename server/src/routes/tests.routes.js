const express = require("express");
const { body, validationResult, param } = require("express-validator");

const { Test } = require("../models/Test");
const { requireAuth, requireRole } = require("../middleware/auth");

const testsRouter = express.Router();

function respondValidationErrors(req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;
  return res.status(400).json({
    detail: result.array().map((e) => e.msg).join(", "),
  });
}

// Teacher: create a test with questions
testsRouter.post(
  "/",
  requireAuth,
  requireRole("teacher"),
  [
    body("title").isString().trim().notEmpty().withMessage("title is required"),
    body("description").optional().isString().trim(),
    body("questions").isArray({ min: 1 }).withMessage("questions must be a non-empty array"),
    body("questions.*.text").isString().trim().notEmpty().withMessage("question.text is required"),
    body("questions.*.options").isArray({ min: 4, max: 4 }).withMessage("question.options must have 4 items"),
    body("questions.*.options.*").isString().withMessage("option must be string"),
    body("questions.*.correctIndex").isInt({ min: 0, max: 3 }).withMessage("correctIndex must be 0..3"),
    body("questions.*.explanation").optional().isString(),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const teacherId = req.auth.userId;
    const { title, description, questions } = req.body;

    const test = await Test.create({
      teacherId,
      title,
      description: description || "",
      questions,
    });

    res.status(201).json({ test });
  }
);

// Teacher: list own tests
testsRouter.get("/", requireAuth, requireRole("teacher"), async (req, res) => {
  const teacherId = req.auth.userId;
  const tests = await Test.find({ teacherId }).sort({ createdAt: -1 });
  res.json({ tests });
});

// Teacher: delete test
testsRouter.delete(
  "/:testId",
  requireAuth,
  requireRole("teacher"),
  [
    param("testId").isString().notEmpty().withMessage("testId is required"),
  ],
  async (req, res) => {
    const v = respondValidationErrors(req, res);
    if (v) return;

    const teacherId = req.auth.userId;
    const { testId } = req.params;

    const deleted = await Test.findOneAndDelete({ _id: testId, teacherId });
    if (!deleted) return res.status(404).json({ detail: "Test not found" });
    res.json({ ok: true });
  }
);

module.exports = { testsRouter };

