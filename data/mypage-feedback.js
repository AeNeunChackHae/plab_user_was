import { db } from '../mysql.js'
import { feedbackQuery } from '../query/mypage-feedback.js'

export const getUserList = async (matchId) => {
    try {
        const [result] = await db.query(
            feedbackQuery.selectUserList,
            [matchId]
        );
        return result;
    } catch (error) {
        console.error('매치 참여 유저 리스트 조회 오류:', error);
        throw error;
    }
};

export const insertBadFeedback = async (matchId, giverId, userId, feedback) => {
    try {
        const [result] = await db.query(
            feedbackQuery.insertBadFeedback,
            [matchId, giverId, userId, feedback]
        );
        return result;
    } catch (error) {
        console.error('비매너 피드백 삽입 오류:', error);
        throw error;
    }
};

export const insertGoodFeedback = async (matchId, giverId, userId, feedback) => {
    try {
        const [result] = await db.query(
            feedbackQuery.insertGoodFeedback,
            [matchId, giverId, userId, feedback]
        );
        return result;
    } catch (error) {
        console.error('칭찬 피드백 삽입 오류:', error);
        throw error;
    }
};

export const checkBlacklist = async (userId, matchId) => {
    try {
        const [result] = await db.query(
            feedbackQuery.selectBlacklist,
            [userId, matchId]
        );
        return result;
    } catch (error) {
        console.error('블랙리스트 조회 오류:', error);
        throw error;
    }
};

export const upsertBlackUser = async (userId, blackUserId) => {
    try {
        // 1. 데이터 존재 여부 확인
        const [existing] = await db.query(
            feedbackQuery.checkBlackUser,
            [userId, blackUserId]
        );

        if (!existing || existing.length === 0) {
            // 2. 데이터가 없으면 INSERT
            await db.query(
                feedbackQuery.insertBlackUser,
                [userId, blackUserId]
            );
        } else if (existing[0].status_code === 1) {
            // 3. 데이터가 존재하고 상태가 1이면 UPDATE
            await db.query(
                feedbackQuery.reUpdateBlackStatus,
                [userId, blackUserId]
            );
        }

        // 상태가 0이면 아무 작업도 하지 않음
    } catch (error) {
        console.error('블랙리스트 등록/업데이트 오류:', error);
        throw error;
    }
};

