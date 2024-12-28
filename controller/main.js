import { getFilteredMatches, getFilterOptions } from '../data/main.js';

// 매치 목록 데이터 반환
export async function showFilteredMatches(req, res) {
    try {
        let { date, region, gender, level, matchId } = req.body;
        console.log('Received filters:', { date, region, gender, level, matchId }); // matchId 포함하여 로그 출력

        // 필터 값 변환
        region = Array.isArray(region) ? region.map(Number) : [];
        gender = Array.isArray(gender) ? gender.map(Number) : [];
        level = Array.isArray(level) ? level.map(Number) : [];
        matchId = matchId ? Number(matchId) : null; // matchId를 숫자로 변환

        // matchId가 있을 경우 해당 matchId에 대한 매치만 필터링
        if (matchId) {
            console.log(`MatchId Filter Applied: ${matchId}`); // matchId 별도 로그 출력
        }

        const matches = await getFilteredMatches(date, region, gender, level);
        const filters = await getFilterOptions();

        const formattedMatches = matches.map(match => ({
            matchId: match.matchId, // matchId 포함
            startTime: match.match_start_time,
            stadiumName: match.stadium_name,
            gender: match.allow_gender === 0 ? '남자' : match.allow_gender === 1 ? '여자' : '남녀 모두',
            level: match.level_criterion === 0 ? '모든 레벨' :
                   match.level_criterion === 1 ? '아마추어1 이하' : '아마추어2 이상',
            status: match.status_code === 0 ? '미달' : '마감'
        }));

        // 디버깅용 로그
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
