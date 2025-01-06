export const matchActivityQuery = {
    // 활동량 기록 존재 여부 확인
    checkUserMatchActivity: `
        SELECT COUNT(*) AS count
        FROM PFB_PHYSICAL_ACTIVITY
        WHERE user_id = ? AND match_id = ?;
    `,

    // 활동량 기록 삽입
    insertUserMatchActivity: `
        INSERT INTO PFB_PHYSICAL_ACTIVITY (
            user_id,
            match_id,
            activity_time,
            distance,
            kilocalorie,
            heart_rate,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW());
    `,

    // 활동량 기록 수정
    updateUserMatchActivity: `
        UPDATE PFB_PHYSICAL_ACTIVITY
        SET 
            activity_time = ?,
            distance = ?,
            kilocalorie = ?,
            heart_rate = ?,
            updated_at = NOW()
        WHERE user_id = ? AND match_id = ?;
    `
};
