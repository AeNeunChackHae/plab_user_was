import { db } from "../mysql.js";
import { levelQueries } from "../query/mypage-mylevel-level.js";

export async function getLevelStats({ user_id }) {
  try {
    const [result] = await db.execute(levelQueries.getLevelCodeByUserId, [
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
