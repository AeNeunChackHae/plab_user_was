import { updateUserProfile } from "../data/mypage-change-profile.js";

export const modifyProfile = async (req, res) => {
  try {
    const { email, username, introduce, gender, prefer_position, ability } =
      req.body;

    // 필수 데이터 확인
    if (!email || !username || !gender || !prefer_position || !ability) {
      return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
    }

    // 데이터 업데이트
    const isUpdated = await updateUserProfile({
      email, // 유저 식별용
      username,
      introduce,
      gender,
      prefer_position,
      ability,
    });

    // 업데이트 결과 처리
    if (isUpdated) {
      return res
        .status(200)
        .json({ message: "프로필이 성공적으로 변경되었습니다." });
    } else {
      return res
        .status(404)
        .json({ message: "이메일에 해당하는 사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("프로필 수정 중 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
