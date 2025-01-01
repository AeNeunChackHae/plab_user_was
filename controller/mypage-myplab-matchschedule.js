import {
  getMatchScheduleByUserId,
  getCompletedMatchesByUserId,
  cancelSocialMatchByUserId,
  checkTeamMatchById,
} from "../data/mypage-myplab-matchschedule.js";

// 매치 일정 불러오는 함수 (tab1)
export async function getMatchScheduleController(req, res) {
  const { user_id } = req.body;
  console.log(user_id);

  if (!user_id) {
    return res.status(400).json({ message: "유저 ID가 필요합니다" });
  }

  try {
    const matchSchedule = await getMatchScheduleByUserId(user_id);

    if (matchSchedule.length === 0) {
      return res.status(404).json({ message: "매치 일정이 없습니다" });
    }

    return res.status(200).json(matchSchedule);
  } catch (error) {
    console.error("매치 일정 fetch 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}

// 완료된 매치 불러오는 함수 (tab2)
export async function getCompletedMatchesControllerPlab(req, res) {
  const { user_id } = req.body;
  console.log(user_id);

  if (!user_id) {
    return res.status(400).json({ message: "유저 ID가 필요합니다" });
  }

  try {
    const completedMatches = await getCompletedMatchesByUserId(user_id);

    if (completedMatches.length === 0) {
      return res.status(404).json({ message: "완료된 매치가 없습니다" });
    }

    return res.status(200).json(completedMatches);
  } catch (error) {
    console.error("완료된 매치 fetch 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
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
