import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.js";
import { config } from "../config.js";

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log('헤더받아온값',authHeader);

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json({ message: "유효하지 않은 인증 정보입니다." });
  }
  const token = authHeader.split(" ")[1];
  console.log("토큰 받아서 저장한 값",token)

  jwt.verify(token, config.jwt.user_secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      console.error("JWT Verify Error:", error);
      return res.status(401).json({ message: "토큰이 유용하지 않습니다." });
    }
    const user = await authRepository.findById(decoded.id);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json({ message: "사용자를 찾을수 없습니다." });
    }
    req.userId = user.id;
    next();
  });
};
