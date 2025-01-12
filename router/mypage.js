import express from "express";
import { isAuth } from "../middleware/auth.js";
import { getMyInfo } from "../controller/mypage.js";
import { getUserMatchSchedule, cancelSocialMatch } from "../controller/mypage-myplab.js";
import { getBlacklist, removeBlacklist } from "../controller/mypage-blacklist.js";
import { validatePasswordChange } from '../middleware/validator.js';
import * as mypageChangeController from "../controller/mypage-change.js";
import  * as fileUpload from "../middleware/fileUpload.js"
import * as myLevelController from "../controller/mypage-level.js"
import * as activityController from "../controller/mypage-activity.js"
import * as feedbackController from "../controller/mypage-feedback.js";


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

// 사용자 프로필 조회
router.get("/change/profile", isAuth, mypageChangeController.getUserProfile);

// 사용자 프로필 수정
router.put("/change/profile", isAuth, fileUpload.fileUpload, fileUpload.aws_s3_upload, mypageChangeController.updateUserProfile);

// 사용자 이메일, 생년월일 정보 조회
router.get("/change/general", isAuth, mypageChangeController.getUserInfo);

// 사용자 이메일, 생년월일 정보 수정
router.put("/change/general/birthdate", isAuth, mypageChangeController.updateBirthDate);

// 사용자 비밀번호 변경
router.put("/change/general/password", isAuth, validatePasswordChange, mypageChangeController.updatePassword);

// 마이페이지 > 마이레벨
router.post("/mylevelpics", isAuth, myLevelController.levelStatus); 

// 사이드바 레벨 이미지 path 받아오기
router.get("/mylevel", isAuth, myLevelController.getUserCardsAndFeedbackAndActivity);

// 사용자 활동량 저장 및 수정
router.post("/mylevel/activity", isAuth, activityController.insertOrUpdateUserMatchActivity)

// 매치 참여 유저 리스트
router.get('/feedback/:matchId', isAuth, feedbackController.getMatchUserList);

// 비매너 피드백 등록
router.post('/feedback/:matchId/bad', isAuth, feedbackController.registerBadFeedback);

// 칭찬 피드백 등록
router.post('/feedback/:matchId/good', isAuth, feedbackController.registerGoodFeedback);

// 사용자가 등록한 블랙리스트 확인
router.get('/feedback/:matchId/checkblack', isAuth, feedbackController.getBlacklistStatus);

// 블랙리스트 등록 및 업데이트
router.post('/blacklist/add', isAuth, feedbackController.registerOrUpdateBlacklist);

// 구장 정보 불러오기
router.get('/feedback/:matchId/stadium', isAuth, feedbackController.getMatchStadiumDetails);

// 구장 부정적 리뷰 등록
router.post('/feedback/:matchId/stadium/bad', isAuth, feedbackController.addBadStadium);

// 구장 긍정적 리뷰 등록
router.post('/feedback/:matchId/stadium/good', isAuth, feedbackController.addGoodStadium);

export default router;
