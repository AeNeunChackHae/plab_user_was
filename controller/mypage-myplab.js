import {
  getMatchScheduleByUserId,
  getCancelledScheduleByUser,
  getUnderCapacityCancelledSchedule,
  getCompletedMatchesByUserId,
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

// 매치 취소하는 함수
export async function cancelMatchController(req, res) {
  const { matchId, userId, teamId } = req.body;

  if (!matchId || !userId) {
    return res.status(400).json({ message: "Match ID와 User ID가 필요합니다" });
  }

  try {
    // 팀 매치 여부 확인
    const leaderId = await checkTeamMatchById({ matchId });

    if (leaderId) {
      // 팀 매치인 경우
      if (!teamId || leaderId !== userId) {
        return res
          .status(400)
          .json({ message: "팀 매치는 팀 리더에게 문의하세요." });
      }

      // 팀 매치 취소 처리
      const teamSuccess = await cancelTeamMatchByLeader({
        matchId,
        teamId,
        leaderId,
      });

      if (!teamSuccess) {
        return res.status(500).json({ message: "팀 매치 취소에 실패했습니다" });
      }

      return res.status(200).json({ message: "팀 매치 취소에 성공했습니다" });
    }

    // 소셜 매치 취소 처리
    const socialSuccess = await cancelSocialMatchByUserId({ matchId, userId });

    if (!socialSuccess) {
      return res.status(500).json({ message: "매치 취소에 실패했습니다" });
    }

    return res.status(200).json({ message: "매치 취소에 성공했습니다" });
  } catch (error) {
    console.error("매치 취소 실패:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}
