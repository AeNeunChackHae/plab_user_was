export const matchQuery ={
    selectMatchByMatchs : 
    `
      SELECT
        id AS match_id,
        stadium_id,
        match_type,
        match_start_time 
      FROM 
        PFB_MATCH 
      WHERE 
        id = ?
    `,
    joinMatchAndStadium :
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
    joinMatchAndManager: 
    `
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
    joinMatchUserWithUserLevels: `
      SELECT 
        u.level_code
      FROM 
        PFB_MATCH_USER mu
      INNER JOIN 
        PFB_USER u ON mu.user_id = u.id
      WHERE 
        mu.match_id = ? 
        AND mu.status_code = 0;
    `,
    joinMatchAndStadiums: `
      SELECT 
        s.width, 
        s.height, 
        s.notice, 
        s.shower_yn AS shower, 
        s.sell_drink_yn AS sellDrink, 
        s.lend_shoes_yn AS lendShoes, 
        s.parking_yn AS parking 
      FROM 
        PFB_MATCH m
      INNER JOIN 
        PFB_STADIUM s ON m.stadium_id = s.id
      WHERE 
        m.id = ?;
    `,
    getTeamDataByMatchId : `
      SELECT 
        t.embulum_path,
        t.team_name,
        COUNT(tm.user_id) AS members_count,
        ROUND(AVG(YEAR(CURDATE()) - YEAR(u.birth_date)), 1) AS average_age,
        tlr.matches_played,
        tlr.goals,
        tlr.points,
        CASE 
          WHEN AVG(u.level_code) < 2 THEN '아마추어1'
          WHEN AVG(u.level_code) < 3 THEN '아마추어2'
          ELSE '아마추어3'
        END AS team_level
      FROM 
        PFB_MATCH_TEAM mt
      JOIN 
        PFB_TEAM t ON mt.team_id = t.id
      JOIN 
        PFB_TEAM_MEMBER tm ON t.id = tm.team_id
      JOIN 
        PFB_USER u ON tm.user_id = u.id
      JOIN 
        PFB_TEAM_LEAGUE_RANKING tlr ON t.id = tlr.team_id
      WHERE 
        mt.match_id = ?
        AND mt.status_code = 0
      GROUP BY 
        t.id;
    `,
    getTeamsByMatchIdQuery : `
      SELECT 
          t.id AS team_id,
          t.team_name,
          t.embulum_path,
          m.match_start_time
      FROM 
          PFB_MATCH_TEAM mt
      JOIN 
          PFB_TEAM t ON mt.team_id = t.id
      JOIN 
          PFB_MATCH m ON mt.match_id = m.id
      WHERE 
          mt.match_id = ?;

    `

}


