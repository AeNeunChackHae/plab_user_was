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
