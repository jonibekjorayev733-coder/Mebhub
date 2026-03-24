const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function hashPassword(password) {
  // bcryptjs is synchronous by default; still wrap for readability
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function signAccessToken({ userId, role }) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
  if (!secret) throw new Error("Missing env var: JWT_SECRET (or SECRET_KEY)");

  return jwt.sign({ sub: userId, role }, secret, { expiresIn });
}

module.exports = { hashPassword, verifyPassword, signAccessToken };

