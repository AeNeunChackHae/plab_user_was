import { db } from "../mysql.js";
import { mypageQuery } from "../query/mypage.js";

export async function fetchMyInfo(email) {
  return db
    .execute(mypageQuery.selectUserMypageByEmail, [email]) // 이메일 바인딩
    .then((result) => result[0][0]); // 결과에서 첫 번째 행 반환
}
