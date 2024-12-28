import { db } from '../mysql.js';
import { getMatchesQuery } from '../query/explore.js';

/**
 * 매치 목록을 가져옵니다.
 * @param {string} matchCode - 매치 코드 (1~5)
 * @returns {Promise<Array>} - 매치 목록 반환
 */
export const fetchMatchesByType = async (matchCode) => {
    try {
        const days = matchCode === '1' ? 10 : 14;
        console.log(`[DEBUG] SQL Query Params: days=${days}, matchCode=${matchCode}`);

        const [rows] = await db.execute(getMatchesQuery, [
            days,
            matchCode,
            matchCode,
            matchCode,
            matchCode,
            matchCode,
        ]);

        console.log('[DEBUG] SQL Query Result:', rows);

        if (!Array.isArray(rows)) {
            console.warn('[WARN] SQL Query did not return an array!');
        }

        return rows;
    } catch (error) {
        console.error('[ERROR] fetchMatchesByType:', error.message);
        throw error;
    }
};
