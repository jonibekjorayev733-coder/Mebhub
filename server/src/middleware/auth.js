const jwt = require("jsonwebtoken");

function getTokenFromReq(req) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");
  if (scheme === "Bearer" && token) return token;
  return null;
}

function requireAuth(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ detail: "Missing access token" });

    const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
    const payload = jwt.verify(token, secret);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
    };
    return next();
  } catch (e) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ detail: "Not authenticated" });
    if (req.auth.role !== role) return res.status(403).json({ detail: "Forbidden" });
    return next();
  };
}

module.exports = { requireAuth, requireRole };

