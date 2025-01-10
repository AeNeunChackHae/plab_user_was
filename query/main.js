export const matchQuery = {
    selectFilteredMatches: `
        SELECT 
            m.id AS matchId,
            s.stadium_name,
            DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
            m.allow_gender,
            m.level_criterion,
            m.status_code,
            s.main_region
        FROM 
            PFB_MATCH AS m
        JOIN 
            PFB_STADIUM AS s ON m.stadium_id = s.id
        WHERE 
            m.match_start_time > NOW() -- 현재 시간 이후의 데이터만
            AND m.match_start_time <= DATE_ADD(NOW(), INTERVAL 14 DAY) -- 14일 이내의 데이터만
            AND m.match_type = 0 -- 소셜 매치만
            AND m.status_code IN (0, 1) -- 모집중, 마감만
            AND m.manager_id IS NOT NULL -- 매니저 ID가 NULL이 아닌 데이터만
            {dateCondition}
            {regionCondition}
            {genderCondition}
            {levelCondition}
        GROUP BY 
            m.id, s.stadium_name, m.match_start_time, m.allow_gender, m.level_criterion, m.status_code, s.main_region
        ORDER BY 
            m.match_start_time ASC;
    `,
    
    selectFilterOptions: `
        SELECT 
            DISTINCT s.main_region AS region,
            m.allow_gender AS gender,
            m.level_criterion AS level
        FROM 
            PFB_MATCH AS m
        JOIN 
            PFB_STADIUM AS s ON m.stadium_id = s.id
        WHERE 
            m.match_start_time >= NOW()
            AND m.match_start_time <= DATE_ADD(NOW(), INTERVAL 14 DAY);
    `
};