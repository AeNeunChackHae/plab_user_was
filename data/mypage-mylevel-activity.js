import { db } from "../mysql.js";
import {
  getCompletedMatchesQuery,
  insertPhysicalActivityQuery,
} from "../query/mypage-mylevel-activity.js";

// 완료된 매치 리스트 가져오기
export async function fetchCompletedMatches({ userId }) {
  try {
    const [result] = await db.execute(getCompletedMatchesQuery, [userId]);
    return result.length > 0 ? result : []; // Return completed matches or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("완료된 매치를 가져오는 중 오류가 발생했습니다.");
  }
}

// 새로운 활동량 데이터 삽입
export const addPhysicalActivity = async (
  userId,
  matchId,
  activityTime,
  distance,
  kilocalorie
) => {
  try {
    const [result] = await db.execute(insertPhysicalActivityQuery, [
      userId,
      matchId,
      activityTime,
      distance,
      kilocalorie,
    ]);
    return result;
  } catch (error) {
    console.error("Error inserting physical activity:", error);
    throw error;
  }
};
