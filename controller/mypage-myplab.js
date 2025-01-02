import {
  getMatchScheduleByUserId,
  getCancelledScheduleByUser,
  getUnderCapacityCancelledSchedule,
  getCompletedMatchesByUserId,
  cancelSocialMatchByUserId,
} from "../data/mypage-myplab.js";

/**
 * @desc 사용자 매치 스케줄 및 완료된 매치 데이터 불러오기
 * @route POST /mypage/myplab
 * @access Private
 */
export async function getUserMatchSchedule(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    // Tab1 데이터 가져오기 (진행 예정, 취소된, 미달로 취소된 매치)
    const [upcomingMatches, cancelledMatches, underCapacityCancelledMatches] = await Promise.all([
      getMatchScheduleByUserId(userId),
      getCancelledScheduleByUser(userId),
      getUnderCapacityCancelledSchedule(userId),
    ]);

    // Tab2 데이터 가져오기 (완료된 매치)
    const completedMatches = await getCompletedMatchesByUserId(userId);

    // 결과 반환
    return res.status(200).json({
      upcomingSchedule: {
        upcomingMatches,
        cancelledMatches,
        underCapacityCancelledMatches,
      },
      completedSchedule: {
        completedMatches,
      },
    });
  } catch (error) {
    console.error("Error fetching match schedules:", error);
    return res.status(500).json({
      message: "매치 일정을 불러오는 중 오류가 발생했습니다.",
    });
  }
}

/**
 * @desc 소셜 매치 취소
 * @route POST /mypage/myplabcancel
 * @access Private
 */
export async function cancelSocialMatch(req, res) {
  const { matchId } = req.body;
  const userId = req.userId; // isAuth 미들웨어에서 전달된 사용자 ID 사용

  // 디버깅 메시지
  // console.log("[컨트롤러] 받은 userId:", userId);
  // console.log("[컨트롤러] 받은 matchId:", matchId);

  if (!userId || !matchId) {
    console.error("userId 또는 matchId가 누락되었습니다.");
    return res.status(400).json({ message: "userId와 matchId가 필요합니다." });
  }

  try {
    const result = await cancelSocialMatchByUserId({ userId, matchId });
    console.log("[SQL 결과] 매치 취소 결과:", result);

    if (result.success) {
      console.log("매치 취소 성공:", result.message);
      return res.status(200).json({ success: true, message: result.message });
    } else {
      console.warn("매치를 찾을 수 없음:", result.message);
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("매치 취소 중 오류:", error.message);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 인해 매치를 취소할 수 없습니다.",
    });
  }
}