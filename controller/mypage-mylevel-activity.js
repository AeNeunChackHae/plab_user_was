import {
  fetchCompletedMatches,
  addPhysicalActivity,
} from "../data/mypage-mylevel-activity.js";

// 완료된 매치 리스트 가져오기
export async function getCompletedMatchesController(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "유저 ID가 필요합니다" });
  }

  try {
    const completedMatches = await fetchCompletedMatches({ userId });

    if (completedMatches.length === 0) {
      return res.status(404).json({ message: "완료된 매치가 없습니다" });
    }

    return res.status(200).json(completedMatches);
  } catch (error) {
    console.error("완료된 매치 fetch 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}

// 새로운 활동량 데이터 삽입
export const insertPhysicalActivityController = async (req, res) => {
  const { userId, matchId, activityTime, distance, kilocalorie } = req.body;

  try {
    const result = await addPhysicalActivity(
      userId,
      matchId,
      activityTime,
      distance,
      kilocalorie
    );
    res.status(201).json({
      success: true,
      message: "활동량 데이터가 성공적으로 입력되었습니다",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "활동량 데이터 저장에 실패했습니다",
      error: error.message,
    });
  }
};
