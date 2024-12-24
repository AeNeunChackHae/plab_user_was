import express from "express";
import { db } from "./db.js"; // MySQL 연결 가져오기
import dotenv from "dotenv";
import { config } from "./config.js"

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.HOST_PORT || 8080; // 환경 변수에서 PORT 가져오기

// 테스트용 라우트
app.get("/test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");
    res.json({ success: true, result: rows });
  } catch (error) {
    console.error("DB 테스트 오류:", error);
    res.status(500).json({ error: "DB 연결 실패" });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
