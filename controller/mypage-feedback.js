import * as feedbackRepository from '../data/mypage-feedback.js'

// 매치 참여 유저 리스트 조회
export const getMatchUserList = async (req, res) => {
    const userId = req.userId;
    // console.log(userId)
    const { matchId } = req.params;

    if (!userId || !matchId) {
        return res.status(400).json({ message: 'User ID and Match ID are required' });
    }
    
    try {
        const userList = await feedbackRepository.getUserList(matchId);
        res.status(200).json({ success: true, data: userList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 비매너 유저 피드백 등록
export const registerBadFeedback = async (req, res) => {
    const giverId = req.userId; // 사용자(req.userId)가 giver
    try {
        const { matchId } = req.params;
        const { userId, feedback } = req.body; // 사용자의 피드백을 받은 사람이 userId
        // !feedback: 숫자 0도 null로 간주
        if (!feedback && feedback !== 0) {
            return res.status(400).json({ success: false, message: "Feedback is required" });
        }

        if (Array.isArray(feedback)) {
            // 배열인 경우: 각 항목을 개별적으로 삽입
            for (const item of feedback) {
                await feedbackRepository.insertBadFeedback(matchId, giverId, userId, item);
            }
        } else {
            // 단일 값인 경우: 그대로 삽입
            await feedbackRepository.insertBadFeedback(matchId, giverId, userId, feedback);
        }

        res.status(200).json({ success: true, message: 'Bad feedback registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 칭찬 유저 피드백 등록
export const registerGoodFeedback = async (req, res) => {
    const giverId = req.userId; // 사용자(req.userId)가 giver
    try {
        const { matchId } = req.params;
        const { userId, feedback } = req.body; // 사용자의 피드백을 받은 사람이 userId
        if (!feedback && feedback !== 0) {
            return res.status(400).json({ success: false, message: "Feedback is required" });
        }

        if (Array.isArray(feedback)) {
            // 배열인 경우: 각 항목을 개별적으로 삽입
            for (const item of feedback) {
                await feedbackRepository.insertGoodFeedback(matchId, giverId, userId, item);
            }
        } else {
            // 단일 값인 경우: 그대로 삽입
            await feedbackRepository.insertGoodFeedback(matchId, giverId, userId, feedback);
        }

        res.status(200).json({ success: true, message: 'Good feedback registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 블랙리스트 확인
export const getBlacklistStatus = async (req, res) => {
    const userId = req.userId;
    const { matchId } = req.params;

    if (!userId || !matchId) {
        return res.status(400).json({ message: 'User ID and Match ID are required' });
    }

    try {
        const blacklist = await feedbackRepository.checkBlacklist(userId, matchId);
        if (!blacklist || blacklist.length === 0) {
            return res.status(404).json({ success: false, message: 'No blacklist record found for the match' });
        } else {
            res.status(200).json({ success: true, data: blacklist });
        }
    } catch (error) {
        console.error('블랙리스트 조회 오류:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 블랙리스트 등록 또는 업데이트
export const registerOrUpdateBlacklist = async (req, res) => {
    try {
        const userId = req.userId;
        const { blackUserId } = req.body;
        await feedbackRepository.upsertBlackUser(userId, blackUserId);
        res.status(200).json({ success: true, message: 'Blacklist updated successfully' });
    } catch (error) {
        console.error('블랙리스트 등록/업데이트 오류:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 구장 이름 및 주소 조회
export const getMatchStadiumDetails = async (req, res) => {
    const { matchId } = req.params;

    if (!matchId) {
        return res.status(400).json({ message: 'Match ID is required' });
    }

    try {
        const stadiumDetails = await feedbackRepository.getStadiumInfo(matchId);

        if (!stadiumDetails) {
            return res.status(404).json({ message: 'Stadium not found for the given match ID.' });
        }

        res.status(200).json({
            success: true,
            data: {
                stadiumName: stadiumDetails.stadium_name,
                fullAddress: stadiumDetails.full_address,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 긍정적 구장 리뷰 등록
export const addGoodStadium = async (req, res) => {
    const { matchId } = req.params;
    const { feedback } = req.body;
    const userId = req.userId;

    if (!matchId || !userId || feedback === undefined) {
        return res.status(400).json({ message: 'Match ID, User ID, and Feedback are required' });
    }

    try {
        // matchId로 stadiumId를 가져오기
        const stadiumId = await feedbackRepository.findStadiumIdByMatchId(matchId);
        if (!stadiumId) {
            return res.status(404).json({ message: 'Stadium not found for the given match ID' });
        }

        // 피드백 등록
        if (Array.isArray(feedback)) {
            // 배열인 경우: 각 항목을 개별적으로 삽입
            for (const item of feedback) {
                await feedbackRepository.addStadiumReview(stadiumId, userId, 0, item);
            }
        } else {
            // 단일 값인 경우
            await feedbackRepository.addStadiumReview(stadiumId, userId, 0, feedback);
        }

        res.status(200).json({ success: true, message: 'Positive feedback registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 부정적 구장 리뷰 등록
export const addBadStadium = async (req, res) => {
    const { matchId } = req.params;
    const { feedback } = req.body;
    const userId = req.userId;

    if (!matchId || !userId || feedback === undefined) {
        return res.status(400).json({ message: 'Match ID, User ID, and Feedback are required' });
    }

    try {
        // matchId로 stadiumId를 가져오기
        const stadiumId = await feedbackRepository.findStadiumIdByMatchId(matchId);
        if (!stadiumId) {
            return res.status(404).json({ message: 'Stadium not found for the given match ID' });
        }

        // 피드백 등록
        if (Array.isArray(feedback)) {
            // 배열인 경우: 각 항목을 개별적으로 삽입
            for (const item of feedback) {
                await feedbackRepository.addStadiumReview(stadiumId, userId, 1, item);
            }
        } else {
            // 단일 값인 경우
            await feedbackRepository.addStadiumReview(stadiumId, userId, 1, feedback);
        }

        res.status(200).json({ success: true, message: 'Negative feedback registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};