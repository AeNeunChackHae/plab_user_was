import * as stadiumData from "../data/stadium.js";

export async function photoPath(req, res) {
  const { stadium_id } = req.body; // POST 요청 본문에서 stadium_id 가져오기

  if (!stadium_id) {
    return res.status(400).json({ message: "stadium_id가 필요합니다." });
  }

  try {
    const stadium = await stadiumData.findByPhoto(stadium_id);
    if (!stadium) {
      return res.status(404).json({ message: "해당 경기장을 찾을 수 없습니다." });
    }
    res.status(200).json({ photo_path: stadium.photo_path });
  } catch (error) {
    console.error("stadiumPhoto 처리 중 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
