import { db } from '../mysql.js';
import { getLeagueDataQuery, getFilteredCompletedTeamMatchesQuery, getTeamRankingQuery } from '../query/league.js';

/**
 * 특정 지역(main_region)에 따른 매치 필터링
 * @param {string | number | null} main_region
 * @returns {Promise<Array>}
 */
export async function findFilteredLeagueData(main_region) {
  return db
    .execute(getLeagueDataQuery, [main_region, main_region])
    .then((result) => result[0]);
}

/**
 * 특정 지역(main_region)에 따른 완료된 팀 매치 필터링
 * @param {string | number | null} main_region
 * @returns {Promise<Array>}
 */
export async function findFilteredCompletedTeamMatches(main_region) {
  return db
    .execute(getFilteredCompletedTeamMatchesQuery, [main_region, main_region])
    .then((result) => result[0]);
}

/**
 * 성별에 따른 팀 랭킹 조회
 * @param {number} gender - 0: 남자, 1: 여자
 * @returns {Promise<Array>}
 */
export async function findTeamRanking(gender) {
  if (gender === undefined || gender === null) {
    throw new Error('gender 값은 필수입니다. (0: 남자, 1: 여자)');
  }
  
  return db
    .execute(getTeamRankingQuery, [gender])
    .then((result) => result[0]);
}