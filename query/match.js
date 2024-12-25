export const matchQuery ={
    selectMatchByMatchs : 
    `
        SELECT
          id AS match_id,
          stadium_id,
          match_type 
        FROM 
          PFB_MATCH 
        WHERE 
          id = ?`,
    joinMatchAndStaddium :
    `
        SELECT 
            m.match_start_time, 
            m.match_type, 
            m.stadium_id, 
            s.full_address,
            s.stadium_name
        FROM 
            PFB_MATCH m
        JOIN 
            PFB_STADIUM s ON m.stadium_id = s.id
        WHERE 
            m.id = ?;
    `,
    joinMatchAndManager: `
    SELECT 
      m.allow_gender, 
      m.level_criterion, 
      mgr.manager_name
    FROM 
      PFB_MATCH m
    LEFT JOIN 
      PFB_MANAGER mgr
    ON 
      m.manager_id = mgr.id
    WHERE 
      m.id = ?;
  `,
}


