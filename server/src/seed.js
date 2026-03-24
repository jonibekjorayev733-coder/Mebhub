const { User } = require("./models/User");
const { hashPassword } = require("./utils/security");

async function seedTeacherIfNeeded() {
  const email = process.env.ADMIN_EMAIL || process.env.TEACHER_EMAIL;
  const password = process.env.ADMIN_PASSWORD || process.env.TEACHER_PASSWORD;

  if (!email || !password) return;

  const existing = await User.findOne({ email, role: "teacher" });
  if (existing) return;

  const passwordHash = await hashPassword(password);
  await User.create({
    email,
    passwordHash,
    role: "teacher",
    fullName: process.env.TEACHER_FULL_NAME || "Teacher",
  });

  console.log("[edu-arena] Seeded teacher account:", email);
}

module.exports = { seedTeacherIfNeeded };

