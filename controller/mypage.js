import { fetchMyInfo } from "../data/mypage.js";

// POST 요청 처리
export async function getMyInfo(req, res) {
  try {
    const { email } = req.body; // POST 요청 본문에서 email을 가져옴

    if (!email) {
      return res.status(400).json({ message: "email 값이 필요합니다." });
    }

    // 이메일을 기반으로 DB에서 데이터 조회
    const mypageInfo = await fetchMyInfo(email);

    if (!mypageInfo) {
      return res
        .status(404)
        .json({ message: "해당 이메일에 맞는 사용자를 찾을 수 없습니다." });
    }

    // 응답 데이터를 프론트 요구 형식으로 가공
    const responseData = {
      id: mypageInfo.id,
      username: mypageInfo.username,
      prefer_position: mypageInfo.prefer_position,
      level_code: mypageInfo.level_code,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("에러 발생", error);
    res.status(500).json({ message: "서버 오류" });
  }
}
