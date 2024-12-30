import { db } from "../mysql.js";
import { updatePasswordQuery } from "../query/mypage-change-pw.js";

export async function updatePasswordByid({ id, newPassword }) {
  try {
    const [result] = await db.execute(updatePasswordQuery.updatePasswordByid, [
      newPassword,
      id,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("비밀번호 업데이트 중 오류가 발생했습니다.");
  }
}
