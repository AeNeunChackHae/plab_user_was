import { db } from '../mysql.js'

// 이메일 중복 확인
export async function findByEmail(email) {
    return db.execute('SELECT * FROM PFB_USER WHERE email=?', [email])
        .then((result) => result[0][0])
}

// 폰 번호 중복 확인
export async function findByPhone(phone_number) {
    return db.execute('SELECT * FROM PFB_USER WHERE phone_number=?', [phone_number])
        .then((result) => result[0][0])
}

// 회원가입
export async function createUser(user) {
    const {phone_number, email, login_password, username, gender, birth_date} = user
    return db.execute('INSERT INTO PFB_USER (phone_number, email, login_password, username, gender, birth_date) VALUES (?, ?, ?, ?, ?, ?)', [phone_number, email, login_password, username, gender, birth_date])
        .then((result) => result[0].insertId)
}