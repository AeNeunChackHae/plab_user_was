import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from header
  if (!token) return res.status(401).json({ message: "토큰이 필요합니다" });

  jwt.verify(token, config.jwt.secretKey, (err, user) => {
    if (err)
      return res.status(403).json({ message: "사용 가능한 토큰이 아닙니다" });
    req.user = user; // Save extracted user info from token
    next();
  });
};
