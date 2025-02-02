import express from "express";
// import { db } from "mysql2";
import dotenv from "dotenv";
import { config } from "./config.js";
import mainRouter from "./router/main.js";
import authRouter from "./router/auth.js";
import matchRouter from "./router/match.js";
import stadiumRouter from "./router/stadium.js";
import mypageRouter from "./router/mypage.js";
import exploreRouter from "./router/explore.js";
import leagueRouter from "./router/league.js";
import csRouter from "./router/cs.js"
import paymentRouter from "./router/payment.js"
import searchRouter from "./router/search.js"
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
// form에서 받은 데이터 처리
app.use(express.urlencoded({ extended: false }));

// public 폴더를 정적 파일 제공 경로로 설정
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

const port = config.hosting_port.user_back || 8080; // 환경 변수에서 PORT 가져오기

// 테스트용 라우트
app.use("/", mainRouter);
app.use("/auth", authRouter);
app.use("/match", matchRouter);
app.use("/stadium", stadiumRouter);
app.use("/mypage", mypageRouter);
app.use("/explore", exploreRouter);
app.use("/league", leagueRouter);
app.use("/api/cs", csRouter);
app.use("/payment", paymentRouter);
app.use("/api/search", searchRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`서버 실행 중 http://localhost:${port}`);
});
