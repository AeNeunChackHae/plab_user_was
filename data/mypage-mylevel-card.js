import { db } from "../mysql.js";
import { cardQuery } from "../query/mypage-mylevel-card.js";

export async function getCardStats({ id }) {
  try {
    const [result] = await db.execute(cardQuery.getCardStatsById, [id]);
    if (result.length > 0) {
      return result; // 결과 리스트 반환
    }
    return []; // 결과가 없는 경우 빈 배열 반환
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("카드 데이터를 가져오는 중 오류가 발생했습니다.");
  }
}
