import { db } from '../mysql.js';
import { userLevelAndFeedbackQuery } from '../query/mypage-level.js';

// 사용자 레벨 조회
export async function getLevelStatus({ user_id }) {
  try {
    const [result] = await db.execute(userLevelAndFeedbackQuery.getLevelCodeByUserId, [
      user_id,
    ]);
    console.log(`아이디:`, user_id);
    console.log(`데이터:`, result);
    return result.length > 0 ? result : []; // Return matches or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("레벨 데이터를 가져오는 중 오류가 발생했습니다.");
  }
}

// 사용자 카드 정보 조회
export const getUserCards = async (userId) => {
    try {
        const [result] = await db.execute(userLevelAndFeedbackQuery.selectUserLevelAndCards, [userId]);
        if (result.length > 0) {
            return result[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching user level and cards:', error);
        throw error;
    }
};

// 사용자 피드백 정보 조회
export const getUserFeedback = async (userId) => {
    try {
        const [result] = await db.execute(userLevelAndFeedbackQuery.selectUserFeedback, [userId]);
        return result;
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        throw error;
    }
};

// 사용자 활동량 및 매치 정보 조회
export const getUserActivityAndMatches = async (userId) => {
  const [result] = await db.execute(userLevelAndFeedbackQuery.selectUserActivityAndMatches, [userId, userId]);
  return result;
};

// 사용자 활동량 평균 계산
export const getAllUserActivities = async (userId) => {
  const [result] = await db.execute(userLevelAndFeedbackQuery.selectAllUserActivities, [userId]);
  return result;
};