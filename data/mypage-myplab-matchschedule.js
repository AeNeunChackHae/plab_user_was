import { db } from "../mysql.js";
import { mypageMyPlabMatchScheduleQueries } from "../query/mypage-myplab-matchschedule.js";

// Get match schedule (tab1)
export async function getMatchScheduleByUserId(userId) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.getMatchSchedule,
      [userId]
    );
    console.log(result);
    return result.length > 0 ? result : []; // Return matches or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("매치 일정을 가져오는 중 오류가 발생했습니다.");
  }
}

// Get completed matches (tab2)
export async function getCompletedMatchesByUserId(userId) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.getCompletedMatches,
      [userId]
    );
    console.log(result);
    return result.length > 0 ? result : []; // Return completed matches or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("완료된 매치를 가져오는 중 오류가 발생했습니다.");
  }
}

// Cancel a social match
export async function cancelSocialMatchByUserId({ matchId, userId }) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.cancelSocialMatch,
      [matchId, userId, matchId]
    );
    return result.affectedRows > 0; // True if any rows are affected
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("소셜 매치를 취소하는 중 오류가 발생했습니다.");
  }
}

// 팀매치
// Check if a match is a team match and get leader_id
export async function checkTeamMatchById({ matchId }) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.checkTeamMatch,
      [matchId]
    );
    return result.length > 0 ? result[0].leader_id : null; // Return leader_id if found
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("매치 타입 확인 중 오류가 발생했습니다.");
  }
}

// Cancel a team match
export async function cancelTeamMatchByLeader({ matchId, teamId, leaderId }) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.cancelTeamMatch,
      [matchId, teamId, teamId, leaderId]
    );
    return result.affectedRows > 0; // True if any rows are affected
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("팀 매치를 취소하는 중 오류가 발생했습니다.");
  }
}
