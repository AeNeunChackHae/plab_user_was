import { db } from "../mysql.js";
import { updateBirthdateQuery } from "../query/mypage-change-general.js";

// 생일 변경
export async function updateBirthdate({ id, birth_date }) {
  return db
    .execute(updateBirthdateQuery.updateBirthdateByid, [birth_date, id])
    .then((result) => result[0].affectedRows > 0); // 변경된 행이 1개 이상인지 확인
}
