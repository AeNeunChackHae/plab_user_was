import express from "express";
// import { db } from "mysql2";
import dotenv from "dotenv";
import { config } from "./config.js";
import mainRouter from "./router/main.js"
import authRouter from "./router/auth.js";
import matchRouter from "./router/match.js";
import stadiumRouter from "./router/stadium.js"
import mypageRouter from "./router/mypage.js";
import exploreRouter from "./router/explore.js";
import cors from "cors";

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
// form에서 받은 데이터 처리
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);


const port = config.hosting_port.user_back || 8080; // 환경 변수에서 PORT 가져오기

// 테스트용 라우트
app.use("/", mainRouter)
app.use("/auth", authRouter);
app.use("/match", matchRouter);
app.use("/stadium", stadiumRouter)
app.use("/mypage", mypageRouter);
app.use("/mypage/change/profile", mypageRouter);
app.use("/explore", exploreRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`서버 실행 중 http://localhost:${port}`);
});
