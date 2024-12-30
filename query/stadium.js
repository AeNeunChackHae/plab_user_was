export const stadiumQuery ={
  selectstadiumByPhotopath : 'SELECT photo_path FROM PFB_STADIUM WHERE id = ?',
  findStadiumById:
  "SELECT main_region, sub_region, stadium_name, full_address, notice FROM PFB_STADIUM WHERE id = ?",
  findRulesByStadiumId: `
    SELECT 
      parking_yn,
      notice,
      shower_yn,
      sell_drink_yn,
      lend_shoes_yn,
      toilet_yn,
      lend_vest_yn,
      lend_ball_yn
    FROM PFB_STADIUM 
    WHERE id = ?`,
    findMatchesByStadiumId: `
    SELECT 
      m. id AS matchId,
      DATE_FORMAT(match_start_time, '%Y-%m-%d') AS date, 
      DATE_FORMAT(match_start_time, '%H:%i') AS time, 
      s.width, 
      s.height, 
      s.ground_type
    FROM 
      PFB_MATCH m
    JOIN 
      PFB_STADIUM s ON m.stadium_id = s.id
    WHERE 
      m.stadium_id = ?
    ORDER BY 
      match_start_time;
  `,
  findStadiumMatchDetails: `
   SELECT 
      m.id AS match_id,
      DATE_FORMAT(m.match_start_time, '%Y-%m-%d') AS date, 
      DATE_FORMAT(m.match_start_time, '%H:%i') AS time,
      m.allow_gender,
      m.level_criterion,
      s.stadium_name
    FROM 
      PFB_MATCH m
    JOIN 
      PFB_STADIUM s ON m.stadium_id = s.id
    WHERE 
      m.stadium_id = ?;
  `,
  findFeedbackByStadiumId: `
    SELECT 
        m.feedback_type,
        m.feedback,
        COUNT(*) AS count
    FROM 
        PFB_STADIUM_FEEDBACK m
    WHERE 
        m.stadium_id = ?
    GROUP BY 
        m.feedback_type, m.feedback
    ORDER BY 
        m.feedback_type, count DESC
    LIMIT 3`
}