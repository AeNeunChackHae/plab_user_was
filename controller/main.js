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

        // 현재 시간 이후의 매치만 필터링
        const now = new Date(); // 현재 시간

        const filteredMatches = matches.filter(match => {
            const matchTimeUTC = new Date(match.match_start_time); // UTC 시간
            const matchTimeKST = new Date(matchTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
            
            return matchTimeKST > now;
        });

        const formattedMatches = filteredMatches.map(match => {
            let status = '신청 가능'; // 기본값

            // 신청 인원이 16명 이상일 경우 마감
            if (match.applicant_count >= 16) {
                status = '마감';
            }

            // KST로 시간 변환
            const matchTimeUTC = new Date(match.match_start_time);
            const matchTimeKST = new Date(matchTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

            return {
                matchId: match.matchId,
                startTime: `${matchTimeKST.getFullYear()}-${String(matchTimeKST.getMonth() + 1).padStart(2, '0')}-${String(matchTimeKST.getDate()).padStart(2, '0')} ${String(matchTimeKST.getHours()).padStart(2, '0')}:${String(matchTimeKST.getMinutes()).padStart(2, '0')}:${String(matchTimeKST.getSeconds()).padStart(2, '0')}`,
                stadiumName: match.stadium_name,
                gender: match.allow_gender === 0 ? '남자' : match.allow_gender === 1 ? '여자' : '남녀 모두',
                level: match.level_criterion === 0 ? '모든 레벨' :
                       match.level_criterion === 1 ? '아마추어1 이하' : '아마추어2 이상',
                status: status
            };
        });

        console.log('Filtered Matches:', formattedMatches);

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