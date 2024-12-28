import { db } from "../mysql.js";
import { updateUserProfileQuery } from "../query/mypage-change-profile.js";

export async function updateUserProfile({
  email,
  username,
  introduce,
  gender,
  prefer_position,
  ability,
}) {
  return db
    .execute(updateUserProfileQuery.updateUserProfileByEmail, [
      username,
      introduce,
      gender,
      prefer_position,
      ability,
      email,
    ])
    .then((result) => result[0].affectedRows > 0); // 변경된 행이 1개 이상인지 확인
}
