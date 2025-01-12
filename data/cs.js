import { db } from '../mysql.js';

// FAQ 목록 조회
export const getFAQs = async () => {
    const query = "SELECT id, title, content, answer, created_at, updated_at FROM PFB_FAQ WHERE del_yn = 'N' ORDER BY created_at DESC";
    const [rows] = await db.query(query);
    return rows;
};

// FAQ 등록
export const postFAQ = async (user_id, title, content) => {
    try {
        const query = `
            INSERT INTO PFB_FAQ (user_id, title, content, del_yn) VALUES (?, ?, ?, 'N')
        `;
        const [result] = await db.query(query, [user_id, title, content]);
        return { id: result.insertId, title, content, answer: '', user_id };
    } catch (error) {
        throw new Error("FAQ 등록 실패: " + error.message);
    }
};