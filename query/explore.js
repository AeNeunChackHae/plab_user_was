export const getMatchesQuery = `
    SELECT 
        m.id,
        DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
        m.level_criterion,
        m.allow_gender,
        m.status_code,
        s.stadium_name,
        s.full_address,
        s.main_region,
        s.sub_region
    FROM PFB_MATCH m
    JOIN PFB_STADIUM s ON m.stadium_id = s.id
    WHERE 
        m.match_type = 0
        AND m.status_code IN (0, 1)
        AND (
            (? = '1' AND m.match_start_time BETWEEN DATE_ADD(NOW(), INTERVAL 10 DAY) AND DATE_ADD(NOW(), INTERVAL 14 DAY))
            OR (? != '1' AND m.match_start_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 14 DAY))
        )
        AND (
            (? = '1') OR
            (? = '2' AND m.allow_gender = 2) OR
            (? = '3' AND m.allow_gender = 1) OR
            (? = '4' AND m.level_criterion = 1) OR
            (? = '5' AND m.level_criterion = 2)
        )
    GROUP BY 
        m.id,
        m.match_start_time,
        m.level_criterion,
        m.allow_gender,
        m.status_code,
        s.stadium_name,
        s.full_address,
        s.main_region,
        s.sub_region
    ORDER BY m.match_start_time;
`;
