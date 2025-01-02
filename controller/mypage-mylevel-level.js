import { getLevelStats } from "../data/mypage-mylevel-level.js";

export async function fetchLevelStats(req, res) {
  const { user_id } = req.body;
  console.log("컨트롤러 id", user_id);

  if (!user_id) {
    return res.status(400).json({ message: "유저 ID가 필요합니다" });
  }

  try {
    const levelStats = await getLevelStats({ user_id });
    console.log("levelStats", levelStats);

    if (levelStats.length === 0) {
      return res.status(404).json({ message: "레벨 기록을 찾을 수 없습니다." });
    }

    return res.status(200).json(levelStats);
  } catch (error) {
    console.error("Error fetching card stats:", error);
    return res
      .status(500)
      .json({ error: "레벨 데이터를 가져오는 중 오류가 발생했습니다." });
  }
}
