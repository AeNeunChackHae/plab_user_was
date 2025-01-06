import { db } from '../mysql.js';
import { matchActivityQuery } from '../query/mypage-activity.js';

// 활동량 기록 존재 여부 확인
export const checkUserMatchActivity = async (userId, matchId) => {
    const [result] = await db.execute(matchActivityQuery.checkUserMatchActivity, [userId, matchId]);
    return result[0]?.count > 0; // 기록이 있으면 true, 없으면 false 반환
};

// 활동량 기록 삽입
export const insertUserMatchActivity = async (userId, matchId, activityData) => {
    const { activity_time, distance, kilocalorie, heart_rate } = activityData;
    await db.execute(matchActivityQuery.insertUserMatchActivity, [
        userId,
        matchId,
        activity_time,
        distance,
        kilocalorie,
        heart_rate
    ]);
};

// 활동량 기록 수정
export const updateUserMatchActivity = async (userId, matchId, activityData) => {
    const { activity_time, distance, kilocalorie, heart_rate } = activityData;
    await db.execute(matchActivityQuery.updateUserMatchActivity, [
        activity_time,
        distance,
        kilocalorie,
        heart_rate,
        userId,
        matchId
    ]);
};
