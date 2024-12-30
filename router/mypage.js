import express from "express";
import { authenticateToken } from "../middleware/auth_js.js"; // 토큰 인증 2번째 방법
import { getMyInfo } from "../controller/mypage.js";
import { modifyProfile } from "../controller/mypage-change-profile.js";
import { modifyBirthdate } from "../controller/mypage-change-general.js";
import { deleteUser } from "../controller/mypage-withdrawarl.js";
import { updatePassword } from "../controller/mypage-change-pw.js";
import { fetchCardStats } from "../controller/mypage-mylevel-card.js";
import { modifyActivity } from "../controller/mypage-mylevel-acitivity.js";
import {
  getBlacklistedUsersController,
  removeUserFromBlacklistController,
} from "../controller/mypage-blacklist.js";

const router = express.Router();

// 마이페이지 메인 : 토큰 검증 후 getMyinfo 만들어서 데이터 가져오기
router.post("/", authenticateToken, getMyInfo);

// 마이페이지 메인 > 프로필 수정 페이지 : 기존 DB 내 데이터 덮어쓰기
router.put("/change/profile", authenticateToken, modifyProfile);

// 마이페이지 메인 > 개인정보 수정 페이지 : 기존 DB 내 생일 데이터 덮어쓰기
router.put("/change/general", authenticateToken, modifyBirthdate); // 생일 업데이트

// 마이페이지 메인 > 비밀번호 바꾸기 페이지 :
router.put("/change/pw", authenticateToken, updatePassword); // 패스워드 변경

// 마이페이지 메인 > 로그아웃

// 마이페이지 메인 > 탈퇴하기 페이지 :
router.delete("/withdrawal", authenticateToken, deleteUser); // 유저 삭제

// 마이페이지 메인 > 마이레벨 페이지 : sidebar 레벨 이미지 경로, 받은 카드, 피드백, 평균 활동량, 매치 리뷰(활동량 기입)
// router.post("/mylevel", authenticateToken); // 사이드바 레벨 path 받아오기
router.post("/mylevel", authenticateToken, fetchCardStats); // 매니저에게 받은 카드 숫자 불러오기
// router.post("/mylevel", authenticateToken, getFeedbackStats); // 타 플래버 피드백 숫자 불러오기
// router.put("/mylevel", authenticateToken, modifyActivity); // 매치 리뷰 (활동량 기입)

// 마이페이지 메인 > 마이플랩 페이지 : 매치일정, 완료된매치, 구장예약 3개 tab DB에서 데이터 불러오기
// router.post("/myplab", authenticateToken, ) // 매치 일정
// router.post("/myplab", authenticateToken, ) // 완료된 매치
// router.post("/myplab", authenticateToken, ) // 구장 예약

// 마이페이지 메인 > 블랙리스트 페이지 : 추가한 블랙멤버 리스트 불러오기,
router.post("/blacklist", authenticateToken, getBlacklistedUsersController);

// 마이페이지 메인 > 블랙리스트 페이지 : 블랙멤버 삭제 하기
router.delete(
  "/blacklist",
  authenticateToken,
  removeUserFromBlacklistController
);

export default router;
