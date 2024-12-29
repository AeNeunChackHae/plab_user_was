import { findFilteredLeagueData } from '../data/league.js';

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

export async function fetchFilteredLeagueData(req, res) {
  try {
    const { main_region } = req.body;

    // main_region 값이 숫자 형태인지 확인
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