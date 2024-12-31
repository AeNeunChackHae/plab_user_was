import * as matchData from '../data/match.js';



// 매치 ID로 매치 정보 조회
export async function matchDetails(req, res) {
    const { match_id } = req.body;
  
    if (!match_id) {
      return res.status(400).json({ message: 'match_id가 제공되지 않았습니다.' });
    }
  
    try {
      const match = await matchData.findByMatchs(match_id);
      // console.log(match)
      if (!match) {
        return res.status(404).json({ message: '해당 매치 ID에 대한 데이터를 찾을 수 없습니다.' });
      }
      res.status(200).json(match);
    } catch (error) {
      console.error('매치 정보 조회 중 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

// match의 Details 컴포넌트
export async function getMatchDetails(req, res) {
  const { match_id } = req.body;

  if (!match_id) {
    return res.status(400).json({ message: "match_id가 필요합니다." });
  }

  try {
    const matchDetails = await matchData.findDetailsById(match_id);

    if (!matchDetails) {
      return res.status(404).json({ message: "매치 정보를 찾을 수 없습니다." });
    }

    res.status(200).json(matchDetails);
  } catch (err) {
    console.error("매치 세부 정보 처리 중 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}



export async function matchPoints(req, res) {
  const { match_id } = req.body;

  if (!match_id) {
    return res.status(400).json({ message: 'match_id가 제공되지 않았습니다.' });
  }

  try {
    const matchPoints = await matchData.findMatchPoints(match_id);
    if (!matchPoints) {
      return res.status(404).json({ message: '해당 매치 ID에 대한 데이터를 찾을 수 없습니다.' });
    }
    res.status(200).json(matchPoints);
  } catch (error) {
    console.error('매치 포인트 조회 중 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

export const getTeamData = async (req, res) => {
  const { match_id } = req.body;

  if (!match_id) {
    return res.status(400).json({ message: "match_id가 필요합니다." });
  }

  try {
    const teamData = await matchData.getTeamDataByMatchId(match_id); // 데이터 가져오기
    
    if (!teamData) {
      return res.status(404).json({ message: "팀 데이터를 찾을 수 없습니다." });
    }
    res.json(teamData);
  } catch (error) {
    console.error("getTeamData 오류:", error);
    res.status(500).json({ message: "팀 데이터를 가져오는 중 오류가 발생했습니다." });
  }
};


export async function getStadiumInfo(req, res) {
  const { match_id } = req.body;

  if (!match_id) {
    return res.status(400).json({ message: "match_id가 제공되지 않았습니다." });
  }

  try {
    const stadiumInfo = await matchData.getStadiumInfoByMatchId(match_id);

    if (!stadiumInfo) {
      return res.status(404).json({ message: "구장 정보를 찾을 수 없습니다." });
    }

    res.status(200).json(stadiumInfo);
  } catch (error) {
    console.error("구장 정보 조회 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

export async function getTeamsForMatch(req, res) {
  const { match_id } = req.body;
  
  if (!match_id) {
    return res.status(400).json({ message: "match_id는 필수입니다." });
  }

  try {
    const teams = await matchData.getTeamsByMatchId(match_id);
    res.status(200).json(teams);
    
  } catch (error) {
    console.error("getTeamsForMatch 오류:", error);
    res.status(500).json({ message: "팀 데이터를 가져오는 데 실패했습니다." });
  }
}



// 매치에 해당하는 유저들의 레벨 분포와 평균 계산
export async function matchLevelStats(req, res) {
  const { match_id } = req.body;

  if (!match_id) {
    console.log(match_id,'없음')
    return res
      .status(400)
      .json({ message: "match_id가 제공되지 않았습니다." });
  }

  try {
    const userLevels = await matchData.findUserLevelsByMatch(match_id);

    if (!userLevels || userLevels.length === 0) {
      return res.status(404).json({
        message: "해당 매치에 신청한 유저가 없습니다.",
        levelDistribution: [],
        averageLevel: "알 수 없음",
      });
    }

    const levelCodes = userLevels.map((user) => user.level_code);

    // 레벨 카테고리 분류 함수
    const categorizeLevels = (level_code) => {
      if (level_code === 0) return "루키";
      if (level_code >= 1 && level_code <= 3) return "스타터";
      if (level_code >= 4 && level_code <= 6) return "비기너";
      if (level_code >= 7 && level_code <= 9) return "아마추어";
      if (level_code >= 10 && level_code <= 12) return "세미프로";
      if (level_code >= 13 && level_code <= 15) return "프로";
      return "알 수 없음";
    };

    // 레벨 분포 계산
    const categoryCounts = levelCodes.reduce((acc, level) => {
      const category = categorizeLevels(level);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const totalUsers = levelCodes.length;

    const levelDistribution = Object.keys(categoryCounts).map((key) => ({
      label: key,
      value: Math.round((categoryCounts[key] / totalUsers) * 100),
    }));

    // 평균 레벨 계산
    const averageLevel = categorizeLevels(
      Math.round(levelCodes.reduce((sum, level) => sum + level, 0) / totalUsers)
    );

    res.status(200).json({
      levelDistribution,
      averageLevel,
    });
  } catch (error) {
    console.error("매치 레벨 통계 계산 중 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

export async function applyForMatch(req, res) {
  const { match_id, user_id } = req.body;

  if (!match_id || !user_id) {
    return res.status(400).json({ message: "match_id와 user_id가 필요합니다." });
  }

  try {
    await matchData.addSocialMatchParticipant(match_id, user_id); // 소셜 매치에 참여
    res.status(201).json({ message: "매치 신청이 완료되었습니다." });
  } catch (err) {
    console.error("매치 신청 중 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}


export async function blacklistCheck(req, res) {
  const { match_id, user_id } = req.body;

  if (!match_id || !user_id) {
    return res.status(400).json({ message: "매치 ID와 사용자 ID가 필요합니다." });
  }

  try {
    // 매치에 블랙리스트 사용자가 있는지 확인
    const isBlacklisted = await matchData.checkBlacklistInMatch(match_id, user_id);
    res.status(200).json({ isBlacklisted });
  } catch (error) {
    console.error("블랙리스트 확인 오류:", error);
    res.status(500).json({ message: "블랙리스트 확인 중 오류 발생" });
  }
}

// 팀장 여부 확인
export async function teamCheck(req, res) {
  const { match_id, user_id } = req.body;

  if (!match_id || !user_id) {
    return res.status(400).json({ message: "매치 ID와 사용자 ID가 필요합니다." });
  }

  try {
    // PFB_MATCH_TEAM과 PFB_TEAM을 통해 팀장 여부 확인
    const isTeamLeader = await matchData.checkTeamLeaderFromMatch(match_id, user_id);

    res.status(200).json({ isTeamLeader });
  } catch (error) {
    console.error("팀장 확인 오류:", error);
    res.status(500).json({ message: "팀장 확인 중 오류 발생" });
  }
}

