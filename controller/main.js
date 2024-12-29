import { getFilteredMatches, getFilterOptions } from '../data/main.js';

// 매치 목록 데이터 반환
export async function showFilteredMatches(req, res) {
    try {
        let { date, region, gender, level, matchId } = req.body;
        console.log('Received filters:', { date, region, gender, level, matchId });

        // 필터 값 변환
        region = Array.isArray(region) ? region.map(Number) : [];
        gender = Array.isArray(gender) ? gender.map(Number) : [];
        level = Array.isArray(level) ? level.map(Number) : [];
        matchId = matchId ? Number(matchId) : null;

        const matches = await getFilteredMatches(date, region, gender, level);
        const filters = await getFilterOptions();

        const formattedMatches = matches.map(match => {
            let status = '신청 가능'; // 기본값

            // 신청 인원이 16명 이상일 경우 마감
            if (match.applicant_count >= 16) {
                status = '마감';
            }

            return {
                matchId: match.matchId,
                startTime: match.match_start_time,
                stadiumName: match.stadium_name,
                gender: match.allow_gender === 0 ? '남자' : match.allow_gender === 1 ? '여자' : '남녀 모두',
                level: match.level_criterion === 0 ? '모든 레벨' :
                       match.level_criterion === 1 ? '아마추어1 이하' : '아마추어2 이상',
                status: status // 신청 가능 / 마감
            };
        });

        console.log('Formatted Matches:', formattedMatches);

        res.json({
            matches: formattedMatches,
            filters: {
                regions: [...new Set(filters.map(filter => filter.region))],
                genders: [...new Set(filters.map(filter => 
                    filter.gender === 0 ? '남자' : filter.gender === 1 ? '여자' : '남녀 모두'
                ))],
                levels: [...new Set(filters.map(filter => 
                    filter.level === 0 ? '모든 레벨' :
                    filter.level === 1 ? '아마추어1 이하' : '아마추어2 이상'
                ))]
            }
        });
    } catch (error) {
        console.error('Error in showFilteredMatches:', error);
        res.status(500).json({ error: 'Failed to retrieve matches and filters' });
    }
}