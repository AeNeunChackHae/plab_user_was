export const blacklistQueries = {
  // 나의 블랙 리스트 불러오기
  getBlacklistedUsers: `
      SELECT 
        PFB_USER.id AS userId,  
        PFB_BLACK.id AS blacklistId
      FROM PFB_USER
      JOIN PFB_BLACK ON PFB_USER.id = PFB_BLACK.black_user_id
      WHERE PFB_BLACK.user_id = ?
    `,

  // 이 쿼리는 상호평가에서 쓰일 것
  addBlacklist: `
      INSERT INTO PFB_BLACK (user_id, black_user_id)
      VALUES (?, ?)
    `,

  // 버튼 눌러서 블랙 친구 삭제
  removeBlacklist: `
      DELETE FROM PFB_BLACK
      WHERE user_id = ? AND black_user_id = ?
    `,
};
