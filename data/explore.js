import { db } from '../mysql.js';
import { getMatchesQuery } from '../query/explore.js';
import { config } from '../config.js';

/**
 * 매치 목록을 가져옵니다.
 * @param {string} matchCode - 매치 코드 (1~5)
 * @returns {Promise<Array>} - 매치 목록 반환
 */
export const fetchMatchesByType = async (matchCode) => {
    try {
        console.log('매치 코드:', matchCode);

        const [rows] = await db.execute(getMatchesQuery, [
            matchCode,
            matchCode,
            matchCode,
            matchCode,
            matchCode,
            matchCode,
            matchCode
        ]);

        console.log('SQL 쿼리 결과:', rows);

        if (!Array.isArray(rows)) {
            console.warn('SQL 쿼리가 배열을 반환하지 않았습니다');
        }

        const statusCodes = config.stadium_match.match_progress_status_code;

        const formattedRows = rows.map((match) => {
            // console.log(
            //     `매치 ID: ${match.id}, 상태 코드: ${match.status_code}, 매핑된 상태: ${statusCodes[match.status_code]}`
            // );
            return {
                ...match,
                status: statusCodes[match.status_code] || '알 수 없음',
            };
        });

        // console.log('포맷된 SQL 결과:', formattedRows);

        return formattedRows;
    } catch (error) {
        console.error('오류: fetchMatchesByType 함수에서 문제가 발생했습니다:', error.message);
        throw error;
    }
};