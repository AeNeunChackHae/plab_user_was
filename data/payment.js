import { db } from '../mysql.js'
import { paymentQuery } from "../query/payment.js";

// 결제 데이터 저장
export const savePaymentToDatabase = async (paymentData) => {
    const { user_id, match_id, status_code, match_price } = paymentData;
  
    try {
      const [result] = await db.query(paymentQuery.insertPaymentQuery, [
        user_id,
        match_id,
        status_code,
        match_price,
      ]);
  
      return { success: true, paymentId: result.insertId };
    } catch (error) {
      return { success: false, error: error.message };
    }
};

export const getUserById = async (userId) => {
    try {
      const [rows] = await db.query(paymentQuery.getUserByIdQuery, [userId]);
      return rows[0]; // 사용자 정보 반환
    } catch (error) {
      throw new Error("사용자 정보를 가져오는 중 오류 발생");
    }
  };


// 참가자 추가
export async function addSocialMatchParticipant(match_id, user_id) {
  try {
    const [result] = await db.execute(paymentQuery.insertSocialMatchParticipant, [
      match_id,
      user_id,
    ]);
    return result;
  } catch (err) {
    console.error("addSocialMatchParticipant Error:", err);
    throw new Error("소셜 매치 참가 등록 중 오류 발생");
  }
}

// 참가자 수 확인
export async function getCurrentParticipants(match_id) {
  try {
    const [result] = await db.execute(paymentQuery.countParticipants, [match_id]);
    return result[0]?.current_participants || 0;
  } catch (err) {
    console.error("getCurrentParticipants Error:", err);
    throw new Error("참가자 수 확인 중 오류 발생");
  }
}

// 매치 상태 업데이트
export async function updateMatchStatus(match_id) {
  try {
    const [result] = await db.execute(paymentQuery.updateMatchStatus, [match_id]);
    return result;
  } catch (err) {
    console.error("updateMatchStatus Error:", err);
    throw new Error("매치 상태 업데이트 중 오류 발생");
  }
}

// 참가자 중복 확인
export async function checkExistingParticipant(match_id, user_id) {
  try {
    const [result] = await db.execute(paymentQuery.checkExistingParticipant, [
      match_id,
      user_id,
    ]);
    return result.length > 0; // 데이터 존재 여부 반환
  } catch (err) {
    console.error("checkExistingParticipant Error:", err);
    throw new Error("중복 데이터 확인 중 오류 발생");
  }
}

// 특정 조건에서 status_code를 0으로 업데이트
export async function updateStatusToZero(match_id, user_id) {
  try {
    const [result] = await db.execute(paymentQuery.updateStatusToZero, [
      match_id,
      user_id,
    ]);
    return result.affectedRows > 0; // 업데이트 성공 여부 반환
  } catch (err) {
    console.error("updateStatusToZero Error:", err);
    throw new Error("status_code 업데이트 중 오류 발생");
  }
}
