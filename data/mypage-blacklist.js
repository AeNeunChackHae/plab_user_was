import { db } from "../mysql.js";
import { blacklistQueries } from "../query/mypage-blacklist.js";

// 블랙리스트 유저 목록 불러오기
export async function fetchBlacklist(userId) {
  try {
    const [rows] = await db.execute(blacklistQueries.getBlacklistedUsers, [userId]);
    return rows;
  } catch (error) {
    console.error("Error fetching blacklist:", error);
    throw error;
  }
}

// 블랙 유저 추가 -> mypage-feedback.js

// 블랙 유저 상태 업데이트 (삭제: status_code = 1)
export async function updateBlacklistStatus(userId, blackUserId, statusCode) {
  try {
    await db.execute(blacklistQueries.updateBlacklistStatus, [statusCode, userId, blackUserId]);
    return { success: true, message: "Blacklist status updated." };
  } catch (error) {
    console.error("Error updating blacklist status:", error);
    throw error;
  }
}
