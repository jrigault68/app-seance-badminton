const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.warn("⛔ Aucun cookie 'token' reçu");
    return res.status(403).json({ message: "Accès refusé" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.warn("⛔ Token invalide :", err.message);
    return res.status(401).json({ message: "Token invalide" });
  }
};
