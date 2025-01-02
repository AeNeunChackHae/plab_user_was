export const mypageMyPlabMatchScheduleQueries = {
  // 진행 예정 매치 가져오기
  getMatchSchedule: `
    SELECT 
      m.id AS match_id,
      DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
      DATE_FORMAT(m.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
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
      AND mu.status_code = 0
      AND m.status_code IN (0, 1);
    `,

  // 완료된 매치 가져오기
  getCompletedMatches: `
    SELECT 
      m.id AS match_id,
      DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
      DATE_FORMAT(m.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
      s.stadium_name,
      m.match_type,
      m.allow_gender,
      m.level_criterion,
      mu.status_code AS applicant_status,
      CASE 
        WHEN f.id IS NOT NULL THEN 1 -- 사용자가 해당 매치에서 타인에게 피드백을 남긴 경우
        ELSE 0 -- 사용자가 해당 매치에서 타인에게 피드백을 남기지 않은 경우
      END AS feedback_given
    FROM 
      PFB_USER u
    JOIN 
      PFB_MATCH_USER mu ON u.id = mu.user_id
    JOIN 
      PFB_MATCH m ON mu.match_id = m.id
    JOIN 
      PFB_STADIUM s ON m.stadium_id = s.id
    LEFT JOIN 
      PFB_USER_FEEDBACK f ON f.giver_id = u.id AND f.match_id = m.id
    WHERE 
      u.id = ?
      AND mu.status_code IN (0, 2)
      AND m.status_code = 3;
    `,

  // 내가 취소한 매치 가져오기
  getCancelledMatchesByUser: `
    SELECT 
      m.id AS match_id,
      DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
      DATE_FORMAT(m.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
      s.stadium_name
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
      AND mu.status_code = 1;
    `,

  // 미달로 취소된 매치 가져오기
  getUnderCapacityCancelledMatches: `
    SELECT 
      m.id AS match_id,
      DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
      DATE_FORMAT(m.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
      s.stadium_name
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
      AND m.status_code = 4
      AND mu.status_code = 0;
    `,

  // 소셜 매치 신청 취소
  cancelSocialMatch: `
    UPDATE PFB_MATCH_USER
    SET status_code = 1
    WHERE user_id = ? AND match_id = ?;
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
