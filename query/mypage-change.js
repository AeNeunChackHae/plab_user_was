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

    // 사용자 이메일, 생년월일 조회
    selectUserInfo: `SELECT email, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date FROM PFB_USER WHERE id = ?;
`,

    // 사용자 생년월일 변경
    updateUserBirth: `UPDATE PFB_USER SET birth_date = ? WHERE id = ?`,

    // 기존 비밀번호 조회
    selectUserPassword: `SELECT login_password FROM PFB_USER WHERE id = ?`,

    // 비밀번호 변경
    updateUserPassword: `UPDATE PFB_USER SET login_password = ? WHERE id = ?`

};
