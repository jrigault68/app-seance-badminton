const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // injecte dans req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide" });
  }
}

module.exports = verifyToken;
