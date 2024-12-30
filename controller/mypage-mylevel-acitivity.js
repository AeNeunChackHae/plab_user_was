import { updateUserActivity } from "../data/mypage-mylevel-acitivity.js";

export const modifyActivity = async (req, res) => {
  try {
    const { id, match_id, activity_time, distance, kilocalorie, heart_rate } =
      req.body;

    // 필수 데이터 확인
    if (!id || !match_id) {
      return res.status(400).json({ message: "필수 정보가 누락되었습니다." });
    }

    // 데이터 업데이트
    const isUpdated = await updateUserActivity({
      id, // 유저 식별용
      activity_time,
      distance,
      kilocalorie,
      heart_rate,
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
