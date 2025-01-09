export const authQuery = {
    selectUserByEmail: "SELECT * FROM PFB_USER WHERE email=?",
    selectUserByphone: "SELECT * FROM PFB_USER WHERE phone_number=?",
    insertUser:
    "INSERT INTO PFB_USER (phone_number, email, login_password, username, gender, birth_date) VALUES (?, ?, ?, ?, ?, ?)",
    selectUserById: "SELECT * FROM PFB_USER WHERE id=?",
    deleteUserById: 'DELETE FROM PFB_USER WHERE id = ?',
    findEmail: 
    `
        SELECT email
        FROM PFB_USER
        WHERE username = ?
        AND phone_number = ?
        AND status_code = 0;
    `,
    findUserByInfo: 
        `
        SELECT * FROM PFB_USER
        WHERE username = ? AND phone_number = ? AND email = ?
        `,
    updatePassword: 
        `
        UPDATE PFB_USER 
        SET login_password = ? 
        WHERE id = ?
        `,
};

