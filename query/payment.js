export const paymentQuery = {
    insertPaymentQuery : `
        INSERT INTO PFB_PAYMENT (user_id, match_id, status_code, match_price, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `,
    findPaymentByIdQuery : `
      SELECT * FROM PFB_PAYMENT WHERE id = ?
    `,
    getUserByIdQuery :
    `
        SELECT id, username, email, phone_number
        FROM PFB_USER
        WHERE id = ?
    `

}