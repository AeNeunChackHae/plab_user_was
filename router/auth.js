import express from "express";
import * as authController from "../controller/auth.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";
import { logout } from "../controller/auth.js";

const router = express.Router();

const validateLogin = [
  body("email").trim().isEmail().withMessage("이메일 형식으로 입력"),
  body("login_password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("비밀번호 8자 이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin, // 기존 로그인 검증 포함
  body("login_password_confirm")
    .trim()
    .isLength({ min: 8 })
    .withMessage("비밀번호는 8자 이상이어야 합니다."),
  body("username")
    .trim()
    .notEmpty()
    .matches(/^[a-zA-Z0-9가-힣]*$/)
    .isLength({ min: 2, max: 10 })
    .withMessage("이름은 2자 이상 10자 이내여야 합니다."),
  body("phone_number")
    .trim()
    .isLength({ min: 11, max: 11 })
    .matches(/^[0-9]+$/)
    .withMessage("휴대폰 번호는 11자리 숫자만 입력해야 합니다."),

  // 생년월일 검증 추가
  body("year")
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("유효한 연도를 입력하세요."),
  body("month")
    .trim()
    .isInt({ min: 1, max: 12 })
    .withMessage("월은 1~12 사이여야 합니다."),
  body("day")
    .trim()
    .isInt({ min: 1, max: 31 })
    .withMessage("일은 1~31 사이여야 합니다."),
  body().custom((value, { req }) => {
    const { year, month, day } = req.body;

    // 날짜 검증 로직
    const date = new Date(`${year}-${month}-${day}`);
    if (
      isNaN(date.getTime()) ||
      date.getFullYear() != year ||
      date.getMonth() + 1 != month ||
      date.getDate() != day
    ) {
      throw new Error("유효하지 않은 생년월일입니다.");
    }
    return true;
  }),

  validate, // 마지막 검증 실행
];

// 회원가입
router.post("/signup", validateSignup, authController.signup);

// 로그인
router.post("/login", validateLogin, authController.login);

// 로그인 유지
router.get("/me", isAuth, authController.me);

// 사용자 로그아웃
router.post('/logout', isAuth, logout)

// 회원탈퇴
router.delete('/delete', isAuth, authController.deleteAccount)

export default router;
