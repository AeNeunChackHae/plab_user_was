import * as levelRepository from '../data/mypage-activity.js';

export const insertOrUpdateUserMatchActivity = async (req, res) => {
    const userId = req.userId;
    const { matchId, activity_time, distance, kilocalorie, heart_rate } = req.body;

    if (!userId || !matchId || !activity_time || !distance || !kilocalorie || !heart_rate) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // 활동량 기록 존재 여부 확인
        const exists = await levelRepository.checkUserMatchActivity(userId, matchId);

        if (exists) {
            // 기록이 있으면 UPDATE
            await levelRepository.updateUserMatchActivity(userId, matchId, {
                activity_time,
                distance,
                kilocalorie,
                heart_rate
            });
            return res.status(200).json({ message: '활동량 정보가 수정되었습니다.' });
        } else {
            // 기록이 없으면 INSERT
            await levelRepository.insertUserMatchActivity(userId, matchId, {
                activity_time,
                distance,
                kilocalorie,
                heart_rate
            });
            return res.status(200).json({ message: '활동량 정보가 저장되었습니다.' });
        }
    } catch (error) {
        console.error('❌ Error saving activity data:', error);
        return res.status(500).json({ message: 'Failed to save activity data.', error: error.message });
    }
};
