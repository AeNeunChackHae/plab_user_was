import { findFilteredLeagueData, findFilteredCompletedTeamMatches, findTeamRanking } from '../data/league.js';

// 성별 타입 매핑
const genderMap = {
  0: "남자",
  1: "여자",
  2: "남녀 모두"
};

// 지역 타입 매핑
const regionMap = {
  0: "서울",
  3: "인천",
  8: "경기"
};

/**
 * 진행 예정인 팀 매치 목록 조회
 * @param {*} req
 * @param {*} res
 */
export async function fetchFilteredLeagueData(req, res) {
  try {
    const { main_region } = req.body;

    const regionFilter = main_region !== undefined ? parseInt(main_region, 10) : null;

    const leagueData = await findFilteredLeagueData(regionFilter);

    const groupedData = leagueData.reduce((acc, row) => {
      const matchId = row.match_id;
      if (!acc[matchId]) {
        acc[matchId] = {
          match_id: row.match_id,
          match_type: row.match_type,
          match_start_time: row.match_start_time,
          match_end_time: row.match_end_time,
          allow_gender: genderMap[row.allow_gender] || "알 수 없음",
          stadium_name: row.stadium_name,
          main_region: regionMap[row.main_region] || "알 수 없음",
          teams: []
        };
      }

      acc[matchId].teams.push({
        team_id: row.team_id,
        team_status: row.team_status,
        team_name: row.team_name,
        team_logo: row.team_logo
      });

      return acc;
    }, {});

    // league_status 계산
    const finalData = Object.values(groupedData).map((match) => {
      const teamCount = match.teams.length;
      return {
        ...match,
        league_status: teamCount >= 3 ? "마감" : "신청 가능"
      };
    });

    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * 완료된 팀 매치 목록 조회
 * @param {*} req
 * @param {*} res
 */
export async function fetchFilteredCompletedTeamMatches(req, res) {
  try {
    const { main_region } = req.body;

    const regionFilter = main_region !== undefined ? parseInt(main_region, 10) : null;

    const completedMatches = await findFilteredCompletedTeamMatches(regionFilter);

    const groupedData = completedMatches.reduce((acc, row) => {
      const matchId = row.match_id;
      if (!acc[matchId]) {
        acc[matchId] = {
          match_id: row.match_id,
          match_start_time: row.match_start_time,
          match_end_time: row.match_end_time,
          allow_gender: genderMap[row.allow_gender] || "알 수 없음",
          stadium_name: row.stadium_name,
          main_region: regionMap[row.main_region] || "알 수 없음",
          teams: []
        };
      }

      if (row.team_id) {
        acc[matchId].teams.push({
          team_id: row.team_id,
          team_status: row.team_status,
          team_name: row.team_name,
          team_logo: row.team_logo
        });
      }

      return acc;
    }, {});

    // 응답 생성
    const finalData = Object.values(groupedData);

    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * 팀 랭킹 조회 (성별 필수)
 * @param {*} req
 * @param {*} res
 */
export async function fetchTeamRanking(req, res) {
  try {
    const { gender } = req.body;

    if (gender === undefined || gender === null) {
      return res.status(400).json({
        success: false,
        message: 'gender 값은 필수입니다. (0: 남자, 1: 여자)',
      });
    }

    const genderFilter = parseInt(gender, 10);

    if (![0, 1].includes(genderFilter)) {
      return res.status(400).json({
        success: false,
        message: 'gender 값은 0(남자) 또는 1(여자)만 가능합니다.',
      });
    }

    const teamRanking = await findTeamRanking(genderFilter);

    const finalData = teamRanking.map((team, index) => ({
      rank: index + 1,
      team_id: team.team_id,
      team_tag: team.team_tag,
      team_name: team.team_name,
      team_logo: team.team_logo,
      matches_played: team.matches_played,
      goals: team.goals,
      points: team.points,
    }));

    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}