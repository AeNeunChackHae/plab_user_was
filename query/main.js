export const matchQuery = {
    selectFilteredMatches: `
        SELECT 
            M.id AS matchId,
            S.stadium_name,
            M.match_start_time,
            M.allow_gender,
            M.level_criterion,
            M.status_code,
            S.main_region
        FROM 
            PFB_MATCH AS M
        JOIN 
            PFB_STADIUM AS S ON M.stadium_id = S.id
        WHERE 
            M.match_start_time >= NOW()
            AND M.match_start_time <= DATE_ADD(NOW(), INTERVAL 14 DAY)
            {dateCondition}
            {regionCondition}
            {genderCondition}
            {levelCondition}
        ORDER BY 
            M.match_start_time ASC;
    `,
    
    selectFilterOptions: `
        SELECT 
            DISTINCT S.main_region AS region,
            M.allow_gender AS gender,
            M.level_criterion AS level
        FROM 
            PFB_MATCH AS M
        JOIN 
            PFB_STADIUM AS S ON M.stadium_id = S.id
        WHERE 
            M.match_start_time >= NOW()
            AND M.match_start_time <= DATE_ADD(NOW(), INTERVAL 14 DAY);
    `
};
