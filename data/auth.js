import { db } from '../mysql.js'
import { authQuery } from '../query/auth.js'

// 이메일 중복 확인
export async function findByEmail(email) {
    return db.execute(authQuery.email, [email])
        .then((result) => result[0][0])
}

// 폰 번호 중복 확인
export async function findByPhone(phone_number) {
    return db.execute(authQuery.phone, [phone_number])
        .then((result) => result[0][0])
}

// 회원가입
export async function createUser(user) {
    const {phone_number, email, login_password, username, gender, birth_date} = user
    return db.execute(authQuery.insertUser , [phone_number, email, login_password, username, gender, birth_date])
        .then((result) => result[0].insertId)
}