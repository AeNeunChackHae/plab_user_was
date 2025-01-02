import { db } from "../mysql.js";
import { mypageMyPlabMatchScheduleQueries } from "../query/mypage-myplab.js";
import { config } from "../config.js";

// 진행 예정 매치 (tab1)
export async function getMatchScheduleByUserId(userId) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.getMatchSchedule,
      [userId]
    );

    // console.log('진행 예정 매치 (원본 데이터):', result);

    const matchTypeCodes = config.stadium_match.match_type_code;
    const genderTypeCodes = config.stadium_match.match_gender_type_code;
    const levelLimitCodes = config.stadium_match.match_level_limit_code;

    const transformedResult = result.map((match) => ({
      match_id: match.match_id,
      match_start_time: match.match_start_time,
      match_end_time: match.match_end_time,
      stadium_name: match.stadium_name,
      match_type: matchTypeCodes[match.match_type] || "알 수 없음",
      allow_gender: genderTypeCodes[match.allow_gender] || "알 수 없음",
      level_criterion: levelLimitCodes[match.level_criterion] || "알 수 없음",
    }));

    console.log('진행 예정 매치 (변환된 데이터):', transformedResult);

    return transformedResult.length > 0 ? transformedResult : [];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("매치 일정을 가져오는 중 오류가 발생했습니다.");
  }
}

// 내가 취소한 매치 (tab1)
export async function getCancelledScheduleByUser(userId) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.getCancelledMatchesByUser,
      [userId]
    );
    console.log('본인 취소 매치: ', result);
    return result.length > 0 ? result : []; // Return matches or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("매치 일정을 가져오는 중 오류가 발생했습니다.");
  }
}

// 미달로 취소된 매치 (tab1)
export async function getUnderCapacityCancelledSchedule(userId) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.getUnderCapacityCancelledMatches,
      [userId]
    );
    console.log('인원 미달 취소 매치: ', result);
    return result.length > 0 ? result : []; // Return matches or empty array
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("매치 일정을 가져오는 중 오류가 발생했습니다.");
  }
}

// 완료된 매치 (tab2)
export async function getCompletedMatchesByUserId(userId) {
  try {
    const [result] = await db.execute(
      mypageMyPlabMatchScheduleQueries.getCompletedMatches,
      [userId]
    );
    // console.log('완료된 매치 (원본 데이터):', result);

    const matchTypeCodes = config.stadium_match.match_type_code;
    const genderTypeCodes = config.stadium_match.match_gender_type_code;
    const levelLimitCodes = config.stadium_match.match_level_limit_code;

    const transformedResult = result.map((match) => ({
      match_id: match.match_id,
      match_start_time: match.match_start_time,
      match_end_time: match.match_end_time,
      stadium_name: match.stadium_name,
      match_type: matchTypeCodes[match.match_type] || "알 수 없음",
      allow_gender: genderTypeCodes[match.allow_gender] || "알 수 없음",
      level_criterion: levelLimitCodes[match.level_criterion] || "알 수 없음",
    }));

    console.log('완료된 매치 (변환된 데이터):', transformedResult);

    return transformedResult.length > 0 ? transformedResult : [];
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
