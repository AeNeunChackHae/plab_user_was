export const matchQuery = {
    selectFilteredMatches: `
        SELECT 
            M.id AS matchId,
            S.stadium_name,
            M.match_start_time,
            M.allow_gender,
            M.level_criterion,
            S.main_region,
            COUNT(MU.id) AS applicant_count
        FROM 
            PFB_MATCH AS M
        LEFT JOIN 
            PFB_MATCH_USER AS MU ON M.id = MU.match_id AND MU.status_code = 0
        JOIN 
            PFB_STADIUM AS S ON M.stadium_id = S.id
        WHERE 
            M.match_start_time > NOW()
            AND M.match_start_time <= DATE_ADD(NOW(), INTERVAL 14 DAY)
            AND M.match_type = 0
            {dateCondition}
            {regionCondition}
            {genderCondition}
            {levelCondition}
        GROUP BY 
            M.id
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