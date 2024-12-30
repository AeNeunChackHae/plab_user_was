export const blacklistQueries = {
  //
  getBlacklistedUsers: `
      SELECT 
        PFB_USER.id AS userId,  
        PFB_BLACK.id AS blacklistId, 
        PFB_BLACK.status_code AS statusCode
      FROM PFB_USER
      JOIN PFB_BLACK ON PFB_USER.id = PFB_BLACK.black_user_id
      WHERE PFB_BLACK.user_id = ? AND PFB_BLACK.status_code = 0
    `,

  // 이 쿼리는 상호평가에서 쓰는 것
  addBlacklist: `
      INSERT INTO PFB_BLACK (user_id, black_user_id, status_code)
      VALUES (?, ?, 0)
    `,

  // 버튼 눌러서 삭제하는 것
  removeBlacklist: `
      DELETE FROM PFB_BLACK
      WHERE user_id = ? AND black_user_id = ?
    `,
};
