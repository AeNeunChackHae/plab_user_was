import { db } from '../mysql.js';
import { userLevelAndFeedbackQuery } from '../query/mypage-level.js';

// 사용자 레벨 및 카드 정보 조회
export const getUserLevelAndCards = async (userId) => {
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
