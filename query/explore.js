export const getMatchesQuery = `
    SELECT 
        M.id,
        M.match_start_time,
        M.match_end_time,
        M.level_criterion,
        M.allow_gender,
        S.stadium_name,
        S.full_address,
        S.main_region,
        S.sub_region,
        COUNT(U.id) AS applicant_count
    FROM PFB_MATCH M
    JOIN PFB_STADIUM S ON M.stadium_id = S.id
    LEFT JOIN PFB_MATCH_USER U ON M.id = U.match_id AND U.status_code = 0
    WHERE 
        M.match_type = 0
        AND M.match_start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)
        AND (
            (? = '1') OR
            (? = '2' AND M.allow_gender = 2) OR
            (? = '3' AND M.allow_gender = 1) OR
            (? = '4' AND M.level_criterion = 1) OR
            (? = '5' AND M.level_criterion = 2)
        )
    GROUP BY 
        M.id,
        M.match_start_time,
        M.match_end_time,
        M.level_criterion,
        M.allow_gender,
        S.stadium_name,
        S.full_address,
        S.main_region,
        S.sub_region
    ORDER BY M.match_start_time;
`;
