import { db } from "../mysql.js";
import { blacklistQueries } from "../query/mypage-blacklist.js";

// Get blacklisted users by user ID
export async function getBlacklistedUsersById({ id }) {
  try {
    const [result] = await db.execute(blacklistQueries.getBlacklistedUsers, [
      id,
    ]);
    console.log("블랙:", result);
    return result.length > 0 ? result : []; // Return blacklisted users or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("블랙리스트 유저를 가져오는 중 오류가 발생했습니다.");
  }
}

// Add a user to blacklist
export async function addUserToBlacklist({ userId, blackUserId }) {
  try {
    const [result] = await db.execute(blacklistQueries.addBlacklist, [
      userId,
      blackUserId,
    ]);
    return result.affectedRows > 0; // Return true if insertion was successful
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("블랙리스트에 추가하는 중 오류가 발생했습니다.");
  }
}

// Remove a user from blacklist
export async function removeUserFromBlacklist({ userId, blackUserId }) {
  try {
    const [result] = await db.execute(blacklistQueries.removeBlacklist, [
      userId,
      blackUserId,
    ]);
    return result.affectedRows > 0; // Return true if deletion was successful
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("블랙리스트에서 제거하는 중 오류가 발생했습니다.");
  }
}
