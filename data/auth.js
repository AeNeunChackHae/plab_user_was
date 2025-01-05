import { db } from '../mysql.js'
import { authQuery } from '../query/auth.js'
import { mypageMyPlabMatchScheduleQueries } from '../query/mypage-myplab.js'

// 이메일로 사용자 조회
export async function findByEmail(email) {
    return db.execute(authQuery.selectUserByEmail, [email])
        .then((result) => result[0][0])
}

// 전화번호로 사용자 조회
export async function findByPhone(phone_number) {
    return db.execute(authQuery.selectUserByphone, [phone_number])
        .then((result) => result[0][0])
}

// 회원가입
export async function createUser(user) {
    const {phone_number, email, login_password, username, gender, birth_date} = user
    return db.execute(authQuery.insertUser , [phone_number, email, login_password, username, gender, birth_date])
        .then((result) => result[0].insertId)
}

// 사용자 ID로 사용자 조회
export async function findById(id) {
    return db.execute(authQuery.selectUserById, [id])
        .then((result) => result[0][0]);
}

// 사용자 계정 삭제
export async function deleteUserById(id) {
    return db.execute(authQuery.deleteUserById, [id])
      .then((result) => result[0].affectedRows > 0); // 삭제된 행이 있는지 확인
}

// 삭제하기 전 진행 예정 매치 확인
export async function findUpcomingMatchesByUserId(userId) {
    try {
      const [matches] = await db.execute(
        mypageMyPlabMatchScheduleQueries.getMatchSchedule,
        [userId]
      );
      return matches; // 매치 데이터 배열 반환
    } catch (error) {
      console.error('진행 예정 매치 조회 오류:', error);
      throw error;
    }
}