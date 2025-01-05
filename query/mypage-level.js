export const userLevelAndFeedbackQuery = {
    // 사용자 레벨 및 카드 정보 조회
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
            feedback_type,
            feedback,
            COUNT(*) AS count
        FROM PFB_USER_FEEDBACK
        WHERE user_id = ?
        GROUP BY feedback_type, feedback;
    `
};
