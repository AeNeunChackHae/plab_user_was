import express from "express";
import { isAuth } from "../middleware/auth.js";
import { getUserMatchSchedule, cancelSocialMatch } from "../controller/mypage-myplab.js";
import { getBlacklist, addBlacklist, removeBlacklist } from "../controller/mypage-blacklist.js";
import { getUserProfile, updateUserProfile } from "../controller/mypage-change.js";
import  * as fileUpload from "../middleware/fileUpload.js"
// --
import { authenticateToken } from "../middleware/auth_js.js"; // 토큰 인증 2번째 방법
import { getMyInfo } from "../controller/mypage.js";
import { modifyProfile } from "../controller/mypage-change-profile.js";
import { modifyBirthdate } from "../controller/mypage-change-general.js";
import { deleteUser } from "../controller/mypage-withdrawarl.js";
import { updatePassword } from "../controller/mypage-change-pw.js";
import { fetchCardStats } from "../controller/mypage-mylevel-card.js";
import { fetchLevelStats } from "../controller/mypage-mylevel-level.js";
import { getCompletedMatchesController } from "../controller/mypage-mylevel-activity.js";
import { insertPhysicalActivityController } from "../controller/mypage-mylevel-activity.js";

const router = express.Router();

// 마이페이지 메인
router.post("/", isAuth, getMyInfo);

// 소셜 매치 일정(신청, 취소, 완료) 불러오기
router.post("/myplab", isAuth, getUserMatchSchedule);

// 소셜 매치 신청 취소
router.post("/myplabcancel", isAuth, cancelSocialMatch);

// 블랙리스트 목록 불러오기
router.post("/blacklist", isAuth, getBlacklist);

// 블랙리스트 유저 삭제
router.post("/blacklist/remove", isAuth, removeBlacklist);

// 사용자 프로필 조회 및 수정
router.get("/change/profile", isAuth, getUserProfile);
router.put("/change/profile", isAuth, fileUpload.fileUpload, fileUpload.aws_s3_upload, updateUserProfile);

// --

// 블랙리스트 유저 추가
router.post("/blacklist/add", isAuth, addBlacklist);

// 마이페이지 메인 > 프로필 수정 페이지
router.put("/change/profile", authenticateToken, modifyProfile); // 기존 DB 내 데이터 덮어쓰기

// 마이페이지 메인 > 개인정보 수정 페이지
router.put("/change/general", authenticateToken, modifyBirthdate); // 생일 업데이트 (덮어쓰기)

// 마이페이지 메인 > 비밀번호 바꾸기 페이지
router.put("/change/pw", authenticateToken, updatePassword); // 패스워드 변경

// 마이페이지 메인 > 로그아웃

// 마이페이지 메인 > 탈퇴하기 페이지
router.delete("/withdrawal", authenticateToken, deleteUser); // 유저 삭제

// 마이페이지 메인 > 마이레벨 페이지 : sidebar 레벨이미지경로, 받은카드, 피드백, 평균 활동량, 매치 리뷰(활동량 기입)
router.post("/mylevelpics", authenticateToken, fetchLevelStats); // 사이드바 레벨 이미지 path 받아오기
router.post("/card", authenticateToken, fetchCardStats); // 매니저에게 받은 카드 숫자 불러오기
// router.post("/feedbackvoted", authenticateToken, getFeedbackStats); // 타 플래버 피드백 숫자 불러오기
router.post(
  "/getcompletedmatches",
  authenticateToken,
  getCompletedMatchesController
); // 매치 리뷰 (활동량 기입 위한 매치 리스트 불러오기)
router.post("/activity", authenticateToken, insertPhysicalActivityController); // 매치 리뷰 (활동량 기입)


export default router;
