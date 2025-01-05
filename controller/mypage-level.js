import { getUserLevelAndCards, getUserFeedback } from '../data/mypage-level.js';

export const getUserLevelAndFeedbackController = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required in the header' });
    }

    try {
        const userData = await getUserLevelAndCards(userId);
        const feedbackData = await getUserFeedback(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            level: userData.level,
            pom: userData.pom,
            yellow_card: userData.yellow_card,
            red_card: userData.red_card,
            feedback: feedbackData
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
