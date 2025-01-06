import * as levelRepository from '../data/mypage-level.js'

export async function levelStatus(req, res) {
  const { user_id } = req.body;
  console.log("컨트롤러 id", user_id);

  if (!user_id) {
    return res.status(400).json({ message: "유저 ID가 필요합니다" });
  }

  try {
    const levelStats = await levelRepository.getLevelStatus({ user_id });
    console.log("levelStats", levelStats);

    if (levelStats.length === 0) {
      return res.status(404).json({ message: "레벨 기록을 찾을 수 없습니다." });
    }

    return res.status(200).json(levelStats);
  } catch (error) {
    console.error("Error fetching card stats:", error);
    return res
      .status(500)
      .json({ error: "레벨 데이터를 가져오는 중 오류가 발생했습니다." });
  }
};

export const getUserCardsAndFeedbackAndActivity = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
      return res.status(400).json({ message: 'User ID is required in the header' });
  }

  try {
      const userData = await levelRepository.getUserCards(userId);
      const feedbackData = await levelRepository.getUserFeedback(userId);
      const activityMatches = await levelRepository.getUserActivityAndMatches(userId);
      const activities = await levelRepository.getAllUserActivities(userId);

      // 평균 활동량 계산
      const totalDistance = activities.reduce((sum, act) => sum + act.distance, 0);
      const totalCalories = activities.reduce((sum, act) => sum + act.kilocalorie, 0);
      const activityCount = activities.length;

      const avgDistance = activityCount > 0 ? (totalDistance / activityCount).toFixed(1) : 0;
      const avgCalories = activityCount > 0 ? (totalCalories / activityCount).toFixed(1) : 0;

      res.status(200).json({
          level: userData.level,
          pom: userData.pom,
          yellow_card: userData.yellow_card,
          red_card: userData.red_card,
          feedback: feedbackData,
          allMatches: activityMatches,
          average: {
              distance: avgDistance,
              kilocalorie: avgCalories
          }
      });
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error', error });
  }
};
