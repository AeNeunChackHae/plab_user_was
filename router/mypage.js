import express from "express";
import { authenticateToken } from "../middleware/auth_js.js";
import { getMyInfo } from "../controller/mypage.js";
import { modifyProfile } from "../controller/mypage-change-profile.js";
import { modifyBirthdate } from "../controller/mypage-change-general.js";
import { deleteUser } from "../controller/mypage-withdrawarl.js";
// import { updatePassword } from " ";
// import { deleteUser } from " ";

const router = express.Router();

// 마이페이지 메인 : 토큰 검증 후 getMyinfo 만들어서 데이터 가져오기
router.post("/", authenticateToken, getMyInfo);

// 마이페이지 메인 > 프로필 수정 페이지 : 기존 DB 내 데이터 덮어쓰기
router.put("/change/profile", authenticateToken, modifyProfile);

// 마이페이지 메인 > 개인정보 수정 페이지 : 기존 DB 내 생일 데이터 덮어쓰기, 로그아웃
router.put("/change/general", authenticateToken, modifyBirthdate); // 생일 업데이트

// // 마이페이지 메인 > 비밀번호 바꾸기 페이지 :
// router.delete("/change/pw", authenticateToken, updatePassword); // 패스워드 변경

// 마이페이지 메인 > 탈퇴하기 페이지 :
router.delete("/withdrawal", authenticateToken, deleteUser); // 유저 삭제

export default router;
