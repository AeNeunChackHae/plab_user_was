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
    TM.emblem_path AS team_logo
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

export const getFilteredCompletedTeamMatchesQuery = `
  SELECT 
    m.id AS match_id,
    m.match_start_time,
    m.match_end_time,
    m.allow_gender,
    s.stadium_name,
    s.main_region,
    t.team_id,
    t.status_code AS team_status,
    tm.team_name,
    tm.emblem_path AS team_logo
  FROM PFB_MATCH m
  JOIN PFB_STADIUM s ON m.stadium_id = s.id
  LEFT JOIN PFB_MATCH_TEAM t ON m.id = t.match_id
  LEFT JOIN PFB_TEAM tm ON t.team_id = tm.id
  WHERE m.match_type = 1
    AND m.match_end_time < NOW()
    AND (s.main_region = ? OR ? IS NULL)
  ORDER BY m.match_end_time DESC;
`;

export const getTeamRankingQuery = `
  SELECT 
    T.id AS team_id,
    T.team_tag AS team_tag,
    T.team_name,
    T.emblem_path AS team_logo,
    R.matches_played,
    R.goals,
    R.points
  FROM 
    PFB_TEAM T
  JOIN 
    PFB_TEAM_LEAGUE_RANKING R ON T.id = R.team_id
  WHERE 
    R.gender = ?
  ORDER BY 
    R.matches_played DESC,
    R.points DESC;
`;
