import { db } from "../mysql.js";
import { updateUserActivityQuery } from "../query/mypage-mylevel-acitivity.js";

export async function updateUserActivity({
  id, // 유저 식별용
  activity_time,
  distance,
  kilocalorie,
  heart_rate,
}) {
  return db
    .execute(updateUserActivityQuery.updateUserActivityByid, [
      activity_time,
      distance,
      kilocalorie,
      heart_rate,
      id,
    ])
    .then((result) => result[0].affectedRows > 0); // 변경된 행이 1개 이상인지 확인
}
