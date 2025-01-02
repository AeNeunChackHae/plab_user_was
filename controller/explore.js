import { fetchMatchesByType } from '../data/explore.js';
import { config } from '../config.js';


// 상태 코드 매핑
const MATCH_PROGRESS_STATUS = config.stadium_match.match_progress_status_code;
const MATCH_GENDER_TYPE = config.stadium_match.match_gender_type_code;
const MATCH_LEVEL_LIMIT = config.stadium_match.match_level_limit_code;

/**
 * 소셜 매치 중 매치 코드 조건에 해당하는 목록을 가공하여 반환합니다.
 * @param {string} matchCode - 매치 코드 (1~5)
 * @param {Response} res - Express Response 객체
 */
export const getMatchesByType = async (matchCode, res) => {
    try {
        console.log(`컨트롤러: 매치 코드(${matchCode})에 해당하는 매치를 불러옵니다.`);

        const matches = await fetchMatchesByType(matchCode);

        // 디버깅 메시지
        // console.log('원본 매치 데이터:', matches);

        if (!Array.isArray(matches)) {
            console.warn('매치 데이터가 배열 형식이 아닙니다');
            return res.status(500).json({
                success: false,
                message: '데이터베이스에서 반환된 형식이 올바르지 않습니다.',
            });
        }

        // 현재 시간 이후의 매치만 필터링
        const now = new Date();
        const filteredMatches = matches.filter((match) => {
            const matchStartTime = new Date(match.match_start_time);
            return matchStartTime > now;
        });

        // console.log('현재 시간 이후의 매치 데이터:', filteredMatches);

        const formattedMatches = filteredMatches.map((match) => {
            let status = MATCH_PROGRESS_STATUS[0];

            if (match.status_code === 0) {
                status = MATCH_PROGRESS_STATUS[0]; // 모집중
            } else if (match.status_code === 1) {
                status = MATCH_PROGRESS_STATUS[1]; // 마감
            }

            return {
                matchId: match.id,
                startTime: match.match_start_time,
                stadiumName: match.stadium_name,
                address: match.full_address,
                gender: MATCH_GENDER_TYPE[match.allow_gender] || '알 수 없음',
                level: MATCH_LEVEL_LIMIT[match.level_criterion] || '알 수 없음',
                status: status
            };
        });

        console.log('최종 가공된 매치 데이터:', formattedMatches);

        res.status(200).json({
            success: true,
            data: formattedMatches,
        });
    } catch (error) {
        console.error('getMatchesByType 함수에서 문제가 발생했습니다:', error.message);
        res.status(500).json({
            success: false,
            message: '매치 데이터를 불러오는 중 오류가 발생했습니다',
        });
    }
};
