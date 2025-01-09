import fetch from "node-fetch";
import { config } from "../config.js";

// 아임포트 토큰 발급
export const getIamportToken = async () => {
  console.log("[DEBUG] 아임포트 토큰 요청 시작");

  const response = await fetch("https://api.iamport.kr/users/getToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imp_key: config.iamport.api_key, // config에서 API 키 가져오기
      imp_secret: config.iamport.api_secret, // config에서 시크릿 키 가져오기
    }),
  });

  const result = await response.json();

  console.log("[DEBUG] 아임포트 토큰 요청 응답:", result);

  if (result.code === 0) {
    console.log("[DEBUG] 토큰 발급 성공:", result.response.access_token);
    return result.response.access_token;
  } else {
    console.error("[ERROR] 토큰 발급 실패:", result.message);
    throw new Error(`토큰 발급 실패: ${result.message}`);
  }
};

// 결제 검증
export const verifyPayment = async (imp_uid, merchant_uid, token) => {
  console.log("[DEBUG] 결제 검증 요청 시작");
  console.log("[DEBUG] imp_uid:", imp_uid, "merchant_uid:", merchant_uid);

  const response = await fetch(`https://api.iamport.kr/payments/${imp_uid}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await response.json();

  console.log("[DEBUG] 결제 검증 응답:", result);

  if (!response.ok) {
    console.error("[ERROR] 결제 검증 요청 실패:", result.message);
    return false;
  }

  if (result.response.merchant_uid !== merchant_uid) {
    console.error("[ERROR] merchant_uid 불일치:", result.response.merchant_uid, merchant_uid);
    return false;
  }

  console.log("[DEBUG] 결제 검증 성공");
  return true;
};