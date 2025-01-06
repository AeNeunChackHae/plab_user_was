export const csQuery = {
    selectFAQs: "SELECT id, title, content, answer FROM PFB_FAQ WHERE del_yn = 'N'",
    insertFAQ: 
    "INSERT INTO PFB_FAQ (user_id, title, content) VALUES (?, ?, ?)"
};