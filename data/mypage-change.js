import { db } from "../mysql.js";
import { userProfileQuery } from "../query/mypage-change.js";

// 사용자 정보 조회
export async function getUserProfileData(userId) {
  try {
    const [result] = await db.execute(
      userProfileQuery.selectUserProfile,
      [userId]
    );

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    throw new Error("사용자 정보를 조회하는 중 오류가 발생했습니다.");
  }
}

// 사용자 정보 수정
export async function updateUserProfileData(photo_except, userId, profileData) {
  const {
    username,
    gender,
    prefer_position,
    ability,
    introduce,
    profile_path,
  } = profileData;

  console.log('🔍 업데이트 데이터 확인:');
  console.log('photo_except:', photo_except);
  console.log('userId:', userId);
  console.log('username:', username);
  console.log('gender:', gender);
  console.log('prefer_position:', prefer_position);
  console.log('ability:', ability);
  console.log('introduce:', introduce);
  console.log('profile_path:', profile_path);

  try {
    if (photo_except) {
      await db.execute(
        userProfileQuery.updateUserProfileNotPhoto,
        [username, gender, prefer_position, ability, introduce, userId]
      );
    } else {
      await db.execute(
        userProfileQuery.updateUserProfile,
        [username, gender, prefer_position, ability, introduce, profile_path, userId]
      );
    }

    return { success: true, message: "사용자 프로필이 성공적으로 업데이트되었습니다." };
  } catch (error) {
    console.error("사용자 정보 수정 오류:", error);
    throw new Error("사용자 정보를 수정하는 중 오류가 발생했습니다.");
  }
}
