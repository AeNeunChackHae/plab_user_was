export const feedbackQuery = {
    // 매치 참여한 전체 유저 불러오기
    selectUserList: `
        SELECT 
            mu.user_id,
            mu.user_team,
            mu.user_number,
            mu.status_code
        FROM 
            PFB_MATCH_USER mu
        WHERE 
            mu.match_id = ? AND mu.status_code IN (0, 2);
    `,

    // 비매너 유저 피드백
    insertBadFeedback: `
        INSERT INTO PFB_USER_FEEDBACK (match_id, giver_id, user_id, feedback_type, feedback)
        VALUES (?, ?, ?, 1, ?);
    `,

    // 칭찬 유저 피드백
    insertGoodFeedback: `
        INSERT INTO PFB_USER_FEEDBACK (match_id, giver_id, user_id, feedback_type, feedback)
        VALUES (?, ?, ?, 0, ?);
    `,

    // 매치 참여 유저 중 블랙 확인
    selectBlacklist: `
        SELECT
            b.user_id,
            b.black_user_id
        FROM
            PFB_BLACK b
        JOIN
            PFB_MATCH_USER mu
        ON
            b.black_user_id = mu.user_id
        WHERE
            b.user_id = ? AND mu.match_id = ?;
    `,

    // 블랙리스트 존재 여부 확인
    checkBlackUser: `
        SELECT status_code 
            FROM PFB_BLACK 
            WHERE user_id = ? AND black_user_id = ?
    `,

    // 블랙리스트가 없으면 INSERT
    insertBlackUser:`
        INSERT INTO PFB_BLACK (user_id, black_user_id, status_code)
                VALUES (?, ?, 0)
    `,

    // 블랙리스트에 존재하지만 status가 1(차단 해제)이면 UPDATE
    reUpdateBlackStatus:`
        UPDATE PFB_BLACK 
                SET status_code = 0 
                WHERE user_id = ? AND black_user_id = ? AND status_code = 1
    `
};
