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
    console.error("데이터베이스 에러:", error);
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
    console.error("데이터베이스 에러:", error);
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
    const applicantStatusCodes = config.stadium_match.applicant_status_code;

    const transformedResult = result.map((match) => {
      return {
        match_id: match.match_id,
        match_start_time: match.match_start_time,
        match_end_time: match.match_end_time,
        stadium_name: match.stadium_name,
        match_type: matchTypeCodes[match.match_type] || "알 수 없음",
        allow_gender: genderTypeCodes[match.allow_gender] || "알 수 없음",
        level_criterion: levelLimitCodes[match.level_criterion] || "알 수 없음",
        feedback_given: match.feedback_given === 1 ? true : false,
        applicant_status: applicantStatusCodes[Number(match.applicant_status)] || "알 수 없음",
      };
    });

    console.log('완료된 매치 (변환된 데이터):', transformedResult);

    return transformedResult.length > 0 ? transformedResult : [];
  } catch (error) {
    console.error("데이터베이스 에러:", error);
    throw new Error("완료된 매치를 가져오는 중 오류가 발생했습니다.");
  }
}

// 소셜매치 신청 취소 (status_code를 1로 업데이트)
export async function cancelSocialMatchByUserId({ userId, matchId }) {
  try {
    const [result] = await db.execute(mypageMyPlabMatchScheduleQueries.cancelSocialMatch,
      [userId, matchId]
    );

    if (result.affectedRows > 0) {
      console.log(`매치 ID: ${matchId}, 사용자 ID: ${userId} - 매치가 취소되었습니다.`);
      return { success: true, message: "매치가 성공적으로 취소되었습니다." };
    } else {
      console.warn(`매치 ID: ${matchId}, 사용자 ID: ${userId} - 취소할 매치를 찾을 수 없습니다.`);
      return { success: false, message: "취소할 매치를 찾을 수 없습니다." };
    }
  } catch (error) {
    console.error("Database error during match cancellation:", error);
    throw new Error("매치를 취소하는 중 오류가 발생했습니다.");
  }
}
