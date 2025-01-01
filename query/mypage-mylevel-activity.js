// 완료된 매치 리스트 가져오기

export const getCompletedMatchesQuery = `
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
    `;

// 새로운 활동량 데이터 삽입
export const insertPhysicalActivityQuery = `
INSERT INTO PFB_PHYSICAL_ACTIVITY (
    user_id, 
    match_id, 
    activity_time, 
    distance, 
    kilocalorie, 
    created_at, 
    updated_at
)
VALUES 
    (?, ?, ?, ?, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP());
`;
