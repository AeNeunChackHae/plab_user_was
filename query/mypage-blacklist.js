export const blacklistQueries = {
  // 나의 블랙 리스트 불러오기
  getBlacklistedUsers: `
      SELECT 
        PFB_USER.id AS userId,  
        PFB_USER.username AS username,
        PFB_USER.profile_path AS profilePath
      FROM PFB_USER
      JOIN PFB_BLACK ON PFB_USER.id = PFB_BLACK.black_user_id
      WHERE PFB_BLACK.user_id = ?
        AND PFB_BLACK.status_code = 0
  `,

  // 블랙 유저 추가 -> mypage-feedback.js

  // 블랙 유저 상태 변경 (삭제: status_code = 1)
  updateBlacklistStatus: `
      UPDATE PFB_BLACK 
      SET status_code = ?
      WHERE user_id = ? AND black_user_id = ?
  `
};
