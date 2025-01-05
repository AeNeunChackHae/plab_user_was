export const userProfileQuery = {
    // 사용자 정보 조회
    selectUserProfile: `
        SELECT 
            username,
            gender,
            prefer_position,
            ability,
            introduce,
            profile_path
        FROM PFB_USER
        WHERE id = ?;
    `,

    // 사용자 정보 수정 (사진 있음)
    updateUserProfile: `
        UPDATE PFB_USER
        SET 
            username = ?,
            gender = ?,
            prefer_position = ?,
            ability = ?,
            introduce = ?,
            profile_path = ?
        WHERE id = ?;
    `,

    // 사용자 정보 수정 (사진 없음)
    updateUserProfileNotPhoto: `
        UPDATE PFB_USER
        SET 
            username = ?,
            gender = ?,
            prefer_position = ?,
            ability = ?,
            introduce = ?
        WHERE id = ?;
    `,

};
