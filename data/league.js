import { db } from '../mysql.js';
import { getLeagueDataQuery } from '../query/league.js';

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