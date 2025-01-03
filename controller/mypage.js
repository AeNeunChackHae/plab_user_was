import { fetchMyInfo } from "../data/mypage.js";
import { config } from "../config.js";

// POST 요청 처리
export async function getMyInfo(req, res) {
  try {
    const { userId } = req.body; // POST 요청 본문에서 userId를 가져옴

    if (!userId) {
      return res.status(400).json({ message: "userId 값이 필요합니다." });
    }

    // userId를 기반으로 DB에서 데이터 조회
    const mypageInfo = await fetchMyInfo(userId);

    if (!mypageInfo) {
      return res
        .status(404)
        .json({ message: "해당 userId에 맞는 사용자를 찾을 수 없습니다." });
    }

    // position, level, play_style을 매핑 테이블을 사용해 변환
    const positionMapping = config.mypage.position_type_code;
    const levelMapping = config.mypage.level_type_code;
    const playStyleMapping = config.mypage.play_style_code;

    const responseData = {
      userId: mypageInfo.id,
      username: mypageInfo.username,
      prefer_position: positionMapping[mypageInfo.prefer_position] || "알 수 없음",
      userLevel: levelMapping[mypageInfo.level_code] || "알 수 없음",
      playStyle: playStyleMapping[mypageInfo.ability] || "알 수 없음",
      userEmail: mypageInfo.email
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("에러 발생", error);
    res.status(500).json({ message: "서버 오류" });
  }
}
