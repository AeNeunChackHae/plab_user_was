import mysql from "mysql2/promise";
import { config } from "./config.js";

export const db = mysql.createPool({
  host: config.db.db_host,        // 환경 변수에서 호스트 가져오기
  user: config.db.db_user,        // 환경 변수에서 사용자 이름 가져오기
  password: config.db.db_password, // 환경 변수에서 비밀번호 가져오기
  database: config.db.db_database, // 환경 변수에서 데이터베이스 이름 가져오기
  port: config.db.db_port,        // 환경 변수에서 포트 가져오기
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
