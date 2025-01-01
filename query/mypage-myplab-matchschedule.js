export const mypageMyPlabMatchScheduleQueries = {
  // 매치 일정 가져오기 (tab1)
  getMatchSchedule: `
    SELECT 
      m.id AS match_id,
      m.match_start_time,
      m.match_end_time,
      s.stadium_name,
      m.match_type,
      m.allow_gender,
      m.level_criterion
    FROM 
      PFB_USER u
    JOIN 
      PFB_MATCH_USER mu ON u.id = mu.user_id
    JOIN 
      PFB_MATCH m ON mu.match_id = m.id
    JOIN 
      PFB_STADIUM s ON m.stadium_id = s.id
    WHERE 
      u.id = ?
      AND m.match_start_time > NOW()
      AND mu.status_code = 0; 
    `,

  // 완료된 매치 가져오기 (tab2)
  getCompletedMatches: `
    SELECT 
      m.id AS match_id,
      m.match_start_time,
      m.match_end_time,
      s.stadium_name,
      m.match_type,
      m.allow_gender,
      m.level_criterion
    FROM 
      PFB_USER u
    JOIN 
      PFB_MATCH_USER mu ON u.id = mu.user_id
    JOIN 
      PFB_MATCH m ON mu.match_id = m.id
    JOIN 
      PFB_STADIUM s ON m.stadium_id = s.id
    WHERE 
      u.id = ?
      AND m.match_end_time <= NOW()
      AND mu.status_code = 0;
    `,

  // 매치 취소 (소셜 매치만 취소 가능)
  cancelSocialMatch: `
    DELETE FROM 
      PFB_MATCH_USER
    WHERE 
      match_id = ?
      AND user_id = ?
      AND EXISTS (
        SELECT 1
        FROM PFB_MATCH m
        WHERE 
          m.id = ?
          AND m.match_type = 0 -- 소셜 매치
          AND m.match_start_time > NOW()
      );
    `,

  // 팀 매치 취소 확인 (취소 불가 메시지 처리용)
  checkTeamMatch: `
    SELECT 
      t.leader_id
    FROM 
      PFB_TEAM t
    JOIN 
      PFB_MATCH_TEAM mt ON t.id = mt.team_id
    WHERE 
      mt.match_id = ?;
  `,

  // 팀 매치 취소 가능 여부 확인 및 삭제
  cancelTeamMatch: `
    DELETE FROM PFB_MATCH_TEAM
    WHERE match_id = ? AND team_id = ? AND EXISTS (
      SELECT 1 FROM PFB_TEAM t
      WHERE t.id = ? AND t.leader_id = ?
    );
  `,
};
