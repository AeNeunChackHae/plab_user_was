import { updateBirthdate } from "../data/mypage-change-general.js";

export const modifyBirthdate = async (req, res) => {
  try {
    const { id } = req.user; // 토큰에서 유저 ID 추출
    const { birth_date } = req.body;

    console.log("ID from token:", id);
    console.log("Birthdate from body:", birth_date);

    // 필수 데이터 확인
    if (!id || !birth_date) {
      return res
        .status(400)
        .json({ message: "id와 birthdate는 필수 값입니다." });
    }

    // 데이터 업데이트
    const isUpdated = await updateBirthdate({
      id, // 유저 식별용
      birth_date,
    });

    // 데이터 결과 처리리
    if (isUpdated) {
      return res
        .status(200)
        .json({ message: "프로필이 성공적으로 변경되었습니다." });
    } else {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("생일 업데이트에 실패했습니다:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
