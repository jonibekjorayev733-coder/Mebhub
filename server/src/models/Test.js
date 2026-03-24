const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 4,
        message: "options must contain exactly 4 items (A-D)",
      },
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const TestSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    questions: { type: [QuestionSchema], required: true, validate: { validator: (v) => v.length > 0 } },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", TestSchema);

module.exports = { Test };

