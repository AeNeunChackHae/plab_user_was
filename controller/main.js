import { getFilteredMatches, getFilterOptions } from '../data/main.js';
import { config } from '../config.js';

// 상태 코드 매핑
const MATCH_PROGRESS_STATUS = config.stadium_match.match_progress_status_code;
const MATCH_GENDER_TYPE = config.stadium_match.match_gender_type_code;
const MATCH_LEVEL_LIMIT = config.stadium_match.match_level_limit_code;

// 매치 목록 데이터 반환
export async function showFilteredMatches(req, res) {
    try {
        let { date, region, gender, level, matchId } = req.body;
        // 디버깅 메시지
        // console.log('요청받은 필터:', { 날짜: date, 지역: region, 성별: gender, 레벨: level, 매치ID: matchId });

        // 필터 값 변환
        region = Array.isArray(region) ? region.map(Number) : [];
        gender = Array.isArray(gender) ? gender.map(Number) : [];
        level = Array.isArray(level) ? level.map(Number) : [];
        matchId = matchId ? Number(matchId) : null;

        const matches = await getFilteredMatches(date, region, gender, level);
        const filters = await getFilterOptions();

        // 현재 시간 이후의 매치만 필터링
        const now = new Date();

        const filteredMatches = matches.filter(match => {
            const matchTimeKST = new Date(match.match_start_time);
            return matchTimeKST > now;
        });

        // console.log('현재 시간:', now.toLocaleString('ko-KR'));
        // console.log('필터링된 매치 개수:', filteredMatches.length);

        // 상태 변환 및 데이터 포맷팅
        const formattedMatches = filteredMatches.map(match => {
            let status = MATCH_PROGRESS_STATUS[0];

            if (match.status_code === 0) {
                status = MATCH_PROGRESS_STATUS[0]; // 모집중
            } else if (match.status_code === 1) {
                status = MATCH_PROGRESS_STATUS[1]; // 마감
            }

            return {
                matchId: match.matchId,
                startTime: match.match_start_time,
                stadiumName: match.stadium_name,
                gender: MATCH_GENDER_TYPE[match.allow_gender],
                level: MATCH_LEVEL_LIMIT[match.level_criterion],
                status: status
            };
        });

        console.log('변환된 매치 데이터:', formattedMatches);

        res.json({
            matches: formattedMatches,
            filters: {
                regions: [...new Set(filters.map(filter => filter.region))],
                genders: [...new Set(filters.map(filter => MATCH_GENDER_TYPE[filter.gender]))],
                levels: [...new Set(filters.map(filter => MATCH_LEVEL_LIMIT[filter.level]))]
            }
        });
    } catch (error) {
        console.error('매치 목록 조회 중 오류 발생:', error);
        res.status(500).json({ error: '매치 및 필터 정보를 불러오는 데 실패했습니다.' });
    }
}
