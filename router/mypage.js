import express from "express";
import { isAuth } from "../middleware/auth.js";
import { validatePasswordChange } from '../middleware/validator.js';
import { getUserMatchSchedule, cancelSocialMatch } from "../controller/mypage-myplab.js";
import { getBlacklist, addBlacklist, removeBlacklist } from "../controller/mypage-blacklist.js";
import * as mypageChangeController from "../controller/mypage-change.js";
import  * as fileUpload from "../middleware/fileUpload.js"
import { getMyInfo } from "../controller/mypage.js";
// --
import { authenticateToken } from "../middleware/auth_js.js"; // 토큰 인증 2번째 방법
import { fetchCardStats } from "../controller/mypage-mylevel-card.js";
import { fetchLevelStats } from "../controller/mypage-mylevel-level.js";
import { getCompletedMatchesController } from "../controller/mypage-mylevel-activity.js";
import { insertPhysicalActivityController } from "../controller/mypage-mylevel-activity.js";
import { getUserLevelAndFeedbackController } from "../controller/mypage-level.js";

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
router.get("/change/profile", isAuth, mypageChangeController.getUserProfile);
router.put("/change/profile", isAuth, fileUpload.fileUpload, fileUpload.aws_s3_upload, mypageChangeController.updateUserProfile);

// 사용자 이메일, 생년월일 정보 조회 및 변경
router.get('/change/general', isAuth, mypageChangeController.getUserInfo);
router.put('/change/general/birthdate', isAuth, mypageChangeController.updateBirthDate);
// 비밀번호 변경
router.put('/change/general/password', isAuth, validatePasswordChange, mypageChangeController.updatePassword);

// 사용자 레벨 및 카드 + 피드백 정보 조회
router.get('/mylevel', isAuth, getUserLevelAndFeedbackController);

// --

// 블랙리스트 유저 추가
router.post("/blacklist/add", isAuth, addBlacklist);

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
