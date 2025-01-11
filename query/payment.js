export const paymentQuery = {
    insertPaymentQuery : `
        INSERT INTO PFB_PAYMENT (user_id, match_id, status_code, match_price, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
    findPaymentByIdQuery : `
      SELECT * FROM PFB_PAYMENT WHERE id = ?
    `,
    getUserByIdQuery :
    `
        SELECT id, username, email, phone_number
        FROM PFB_USER
        WHERE id = ?
    `,
    insertSocialMatchParticipant: `
        INSERT INTO PFB_MATCH_USER (match_id, user_id, status_code)
        VALUES (?, ?, 0)
        ON DUPLICATE KEY UPDATE status_code = 0;
    `,
    countParticipants: `
        SELECT COUNT(*) AS current_participants
        FROM PFB_MATCH_USER
        WHERE match_id = ? AND status_code = 0;
    `,
    updateMatchStatus: `
        UPDATE PFB_MATCH
        SET status_code = 1
        WHERE id = ?;
    `,    
    checkExistingParticipant: `
        SELECT status_code
        FROM PFB_MATCH_USER
        WHERE match_id = ? AND user_id = ?;
    `,
    updateStatusToZero: `
        UPDATE PFB_MATCH_USER
        SET status_code = 0
        WHERE match_id = ? AND user_id = ? AND status_code = 1;
    `,
}