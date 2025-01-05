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

// 사용자 이메일 생년월일 조회
export const getUserInfoData = async (userId) => {
  const [result] = await db.execute(userProfileQuery.selectUserInfo, [userId]);
  return result[0];
};

// 생년월일 변경
export const updateBirthDateData = async (userId, birthDate) => {
  await db.execute(userProfileQuery.updateUserBirth, [birthDate, userId]);
};

// 기존 비밀번호 가져오기
export const getUserPassword = async (userId) => {
  const [result] = await db.execute(userProfileQuery.selectUserPassword, [userId]);
  return result[0];
};

// 비밀번호 변경
export const updatePasswordData = async (userId, newPassword) => {
  await db.execute(userProfileQuery.updateUserPassword, [newPassword, userId]);
};
