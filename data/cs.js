import { db } from '../mysql.js';

// FAQ 목록 조회
export const getFAQs = async () => {
    const query = "SELECT id, title, content, answer FROM PFB_FAQ WHERE del_yn = 'N'";
    const [rows] = await db.query(query);
    return rows;
};

// FAQ 등록
export const postFAQ = async (user_id, title, content) => {
    const query = `
        INSERT INTO PFB_FAQ (user_id, title, content)
        VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [user_id, title, content]);
    return result;
};
