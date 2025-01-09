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


// 사용자 email 찾기
export async function findEmailByUserInfo(username, phoneNumber) {
  try {
    const [rows] = await db.execute(authQuery.findEmail, [username, phoneNumber]);
    console.log(rows)
    return rows[0]?.email || null; // 이메일 반환 또는 null
  } catch (error) {
    console.error('Error in findEmailByUserInfo:', error);
    throw error;
  }
}

// 유저 정보 조회
export async function findUserByInfo(name, phoneNumber, email) {
    try {
      const [rows] = await db.execute(authQuery.findUserByInfo, [name, phoneNumber, email]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error in findUserByInfo:", error);
      throw error;
    }
  }
  
  // 비밀번호 업데이트
  export async function updatePassword(userId, hashedPassword) {
    try {
      await db.execute(authQuery.updatePassword, [hashedPassword, userId]);
    } catch (error) {
      console.error("Error in updatePassword:", error);
      throw error;
    }
  }
  
  // 비밀번호 해시화
  export async function hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.error("Error in hashPassword:", error);
      throw error;
    }
  }