import { db } from "../mysql.js";
import { deleteUserQuery } from "../query/mypage-withdrawarl.js";

export async function deleteUsermember({ email }) {
  return db
    .execute(deleteUserQuery.deleteUserByEmail, [email])
    .then((result) => result[0].affectedRows > 0); // 삭제된 행이 1개 이상인지 확인
}
