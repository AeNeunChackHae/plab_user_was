import { db } from '../mysql.js'
import { matchQuery } from '../query/match.js'


export async function findByMatchs(match_id){
    return db.execute(matchQuery.selectMatchByMatchs, [match_id])
    .then((result) => result[0][0])
}

export async function findDetailsById(match_id) {
    return db.execute(matchQuery.joinMatchAndStadium, [match_id])
      .then((result) => result[0][0])
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