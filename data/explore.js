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
        console.log(`SQL 쿼리 실행: 매치 코드(${matchCode})`);

        // 올바른 파라미터 배열
        const params = [
            matchCode,  // 첫 번째 ? → 날짜 범위 조건
            matchCode,  // 두 번째 ? → 날짜 범위 조건
            '1',        // 세 번째 ? → matchCode === '1'
            '2',        // 네 번째 ? → matchCode === '2'
            '3',        // 다섯 번째 ? → matchCode === '3'
            '4',        // 여섯 번째 ? → matchCode === '4'
            '5'         // 일곱 번째 ? → matchCode === '5'
        ];
        console.log('[디버그] 전달된 파라미터:', params);

        // 쿼리 실행
        const [rows] = await db.execute(getMatchesQuery, params);

        console.log('[디버그] SQL 쿼리 결과:', rows);

        if (!Array.isArray(rows)) {
            console.warn('[경고] SQL 쿼리가 배열을 반환하지 않았습니다.');
        }

        const statusCodes = config.stadium_match.match_progress_status_code;

        const formattedRows = rows.map((match) => ({
            ...match,
            status: statusCodes[match.status_code] || '알 수 없음',
        }));

        console.log('[디버그] 포맷된 SQL 결과:', formattedRows);

        return formattedRows;
    } catch (error) {
        console.error('[오류] fetchMatchesByType 함수에서 문제가 발생했습니다:', error.message);
        console.error('[디버깅] 쿼리문:', getMatchesQuery);
        console.error('[디버깅] 전달된 파라미터:', params || '파라미터가 정의되지 않았습니다.');
        throw error;
    }
};