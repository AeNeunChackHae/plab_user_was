export const userLevelAndFeedbackQuery = {
    // 사용자 레벨 조회
    getLevelCodeByUserId: "SELECT level_code FROM PFB_USER WHERE id = ?", 

    // 사용자 카드 정보 조회
    selectUserLevelAndCards: `
        SELECT 
            u.level_code AS level,
            (SELECT COUNT(*) FROM PFB_CARD WHERE user_id = u.id AND card_type = 3) AS pom,
            (SELECT COUNT(*) FROM PFB_CARD WHERE user_id = u.id AND card_type = 0) AS yellow_card,
            (SELECT COUNT(*) FROM PFB_CARD WHERE user_id = u.id AND card_type = 1) AS red_card
        FROM PFB_USER u
        WHERE u.id = ?;
    `,

    // 사용자 피드백 정보 조회
    selectUserFeedback: `
        SELECT 
            f.feedback_type,
            f.feedback,
            COALESCE(COUNT(p.feedback), 0) AS count
        FROM (
            SELECT 0 AS feedback_type, 0 AS feedback
            UNION SELECT 0, 1
            UNION SELECT 0, 2
            UNION SELECT 0, 3
            UNION SELECT 0, 4
            UNION SELECT 1, 0
            UNION SELECT 1, 1
            UNION SELECT 1, 2
            UNION SELECT 1, 3
        ) f
        LEFT JOIN PFB_USER_FEEDBACK p 
        ON p.user_id = ? AND p.feedback_type = f.feedback_type AND p.feedback = f.feedback
        GROUP BY f.feedback_type, f.feedback
        ORDER BY f.feedback_type, f.feedback;
    `,

    // 활동량 및 매치 정보 조회
    selectUserActivityAndMatches: `
        SELECT 
            m.id AS match_id,
            DATE_FORMAT(m.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
            DATE_FORMAT(m.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
            s.stadium_name AS stadium_name,
            COALESCE(pa.match_id, m.id) AS match_id, -- NULL이면 m.id 사용
            pa.activity_time,
            pa.distance,
            pa.kilocalorie,
            pa.heart_rate
        FROM PFB_MATCH_USER mu
        JOIN PFB_MATCH m ON mu.match_id = m.id
        JOIN PFB_STADIUM s ON m.stadium_id = s.id
        LEFT JOIN PFB_PHYSICAL_ACTIVITY pa ON mu.match_id = pa.match_id AND mu.user_id = ?
        WHERE mu.user_id = ?
        AND mu.status_code = 0
        AND m.status_code =3
        ORDER BY m.match_start_time DESC;
    `,

    // 모든 활동량 평균 계산
    selectAllUserActivities: `
        SELECT 
            distance,
            kilocalorie
        FROM PFB_PHYSICAL_ACTIVITY
        WHERE user_id = ?;
    `
};
