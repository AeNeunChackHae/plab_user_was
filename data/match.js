import { db } from '../mysql.js'
import { matchQuery } from '../query/match.js'


export async function findByMatchs(match_id){
    return db.execute(matchQuery.selectMatchByMatchs, [match_id])
    .then((result) => result[0][0])
}

export async function findDetailsById(match_id) {
    console.log("매치 상세 정보 찾기 시작 - match_id:", match_id);
  
    return db.execute(matchQuery.joinMatchAndStadium, [match_id])
      .then(([rows]) => {
        if (rows.length === 0) {
          console.log("매치 정보를 찾을 수 없습니다.");
          return null;
        }
  
        const row = rows[0];
  
        return {
          match_start_time: row.match_start_time,
          match_type: row.match_type,
          stadium_id: row.stadium_id,
          full_address: row.full_address,
          stadium_name: row.stadium_name,
          current_participants: row.current_participants, // 참가자 수 추가
        };
      })
      .catch((err) => {
        console.error("Error in findDetailsById:", err);
        throw err;
      });
  }
  

export async function findMatchPoints(match_id) {
    return db
      .execute(matchQuery.joinMatchAndManager, [match_id])
      .then((result) => result[0][0]);
  }

export async function findUserLevelsByMatch(match_id) {
return db
    .execute(matchQuery.joinMatchUserWithUserLevels, [match_id])
    .then((result) => result[0]);
}

export async function getStadiumInfoByMatchId(match_id) {
return db
    .execute(matchQuery.joinMatchAndStadiums, [match_id])
    .then((result) => result[0][0]);
}

export async function getTeamDataByMatchId(match_id) {
    return db
      .execute(matchQuery.getTeamDataByMatchId, [match_id])
      .then((result) => result[0]) // 전체 결과 반환
  }

export async function getTeamsByMatchId(match_id) {
    return db
        .execute(matchQuery.getTeamsByMatchIdQuery, [match_id])
        .then((result) => result[0]); // 결과 리스트 반환
}

export async function addSocialMatchParticipant(match_id, user_id) {
    try {
      const [result] = await db.execute(matchQuery.insertSocialMatchParticipant, [
        match_id,
        user_id,
      ]);
      return result;
    } catch (err) {
      console.error("addSocialMatchParticipant Error:", err);
      throw new Error("소셜 매치 참가 등록 중 오류 발생");
    }
  }


export async function checkBlacklistInMatch(match_id, user_id) {
    try {
      const [result] = await db.execute(matchQuery.checkBlacklistInMatch, [match_id, user_id]);
      return result[0].count > 0; // 블랙리스트 여부 반환
    } catch (error) {
      console.error("DB 블랙리스트 확인 오류:", error);
      throw error;
    }
  }
  
  // 팀장 여부 확인
export async function checkTeamLeaderFromMatch(match_id, user_id) {
    try {
      const [result] = await db.execute(matchQuery.checkTeamLeaderFromMatch, [match_id, user_id]);
      return result[0].count > 0; // 팀장 여부 반환
    } catch (error) {
      console.error("DB 팀장 확인 오류:", error);
      throw error;
    }
  }

export async function checkApplicationStatus(match_id, user_id) {
    const [rows] = await db.execute(matchQuery.applicationCheck, [match_id, user_id]);
    return rows.length > 0;
  }