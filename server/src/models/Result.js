const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true, index: true },
    score: { type: Number, required: true, min: 0 },
    // Optional: store submission details if you expand later
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Helpful compound index for filtering
ResultSchema.index({ testId: 1, userId: 1 });

const Result = mongoose.model("Result", ResultSchema);

module.exports = { Result };

