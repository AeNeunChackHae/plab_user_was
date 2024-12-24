import express from "express";
// import { db } from "mysql2";
import dotenv from "dotenv";
// import { config } from "./config.js"
import authRouter from "./router/auth.js"

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
// form에서 받은 데이터 처리
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.HOST_PORT || 8080; // 환경 변수에서 PORT 가져오기

// 테스트용 라우트
app.use("/auth", authRouter)

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
