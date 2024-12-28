import { fetchMatchesByType } from '../data/explore.js';

/**
 * 소셜 매치 중 매치 코드 조건에 해당하는 목록을 가공하여 반환합니다.
 * @param {string} matchCode - 매치 코드 (1~5)
 * @param {Response} res - Express Response 객체
 */
export const getMatchesByType = async (matchCode, res) => {
    try {
        console.log(`[DEBUG] Controller: Fetching matches for matchCode=${matchCode}`);

        const matches = await fetchMatchesByType(matchCode);

        console.log('[DEBUG] Raw Matches Data:', matches);

        if (!Array.isArray(matches)) {
            console.warn('[WARN] Matches is not an array!');
            return res.status(500).json({
                success: false,
                message: 'Invalid data format from database',
            });
        }

        const formattedMatches = matches.map((match) => ({
            id: match.id,
            startTime: match.match_start_time,
            endTime: match.match_end_time,
            stadiumName: match.stadium_name,
            address: match.full_address,
            region: `${match.main_region}, ${match.sub_region}`,
            level: match.level_criterion === 1 ? '아마추어1 이하' : '아마추어2 이상',
            gender: match.allow_gender === 1 ? '여성' : match.allow_gender === 2 ? '남녀 모두' : '남성',
            status: match.status_code === 1 || match.status_code === 2 ? '신청 가능' : '마감',
            type: '소셜 매치',
        }));

        console.log('[DEBUG] Formatted Matches Data:', formattedMatches);

        res.status(200).json({
            success: true,
            data: formattedMatches,
        });
    } catch (error) {
        console.error('[ERROR] getMatchesByType:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve matches.',
        });
    }
};
