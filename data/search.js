import { db } from "../mysql.js";

export const searchStadiums = async (query) => {
  try {
    const [rows] = await db.query(
      `
    SELECT 
        s.id AS stadium_id, 
        s.stadium_name, 
        s.full_address, 
        s.photo_path, 
        s.notice,
        MIN(m.id) AS match_id
    FROM 
        PFB_STADIUM s
    LEFT JOIN 
        PFB_MATCH m ON s.id = m.stadium_id
    WHERE 
        s.stadium_name LIKE ? OR 
        s.full_address LIKE ? OR 
        s.notice LIKE ?
    GROUP BY 
        s.id, s.stadium_name, s.full_address, s.photo_path, s.notice;   
      `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows;
  } catch (error) {
    console.error("데이터베이스 검색 중 오류 발생:", error);
    throw new Error("데이터베이스 검색 중 오류 발생");
  }
};
