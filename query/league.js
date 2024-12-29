export const getLeagueDataQuery = `
  SELECT 
    M.id AS match_id,
    M.match_type,
    M.match_start_time,
    M.match_end_time,
    M.allow_gender,
    S.stadium_name,
    S.main_region,
    T.team_id,
    T.status_code AS team_status,
    TM.team_name,
    TM.embulum_path AS team_logo
  FROM 
    PFB_MATCH M
  JOIN 
    PFB_STADIUM S ON M.stadium_id = S.id
  JOIN 
    PFB_MATCH_TEAM T ON M.id = T.match_id
  JOIN 
    PFB_TEAM TM ON T.team_id = TM.id
  WHERE 
    M.match_start_time > NOW()
    AND M.match_type = 1
    AND T.status_code = 0
    AND (? IS NULL OR S.main_region = ?)
  ORDER BY 
    M.match_start_time ASC;
`;
