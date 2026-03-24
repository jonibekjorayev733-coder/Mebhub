require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectMongo } = require("./src/db");
const { authRouter } = require("./src/routes/auth.routes");
const { testsRouter } = require("./src/routes/tests.routes");
const { resultsRouter } = require("./src/routes/results.routes");
const { seedTeacherIfNeeded } = require("./src/seed");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRouter);
app.use("/tests", testsRouter);
app.use("/results", resultsRouter);

async function start() {
  await connectMongo();
  await seedTeacherIfNeeded();

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`[edu-arena] API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("[edu-arena] Failed to start server:", err);
  process.exit(1);
});

