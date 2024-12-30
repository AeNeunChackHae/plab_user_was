import { getCardStats } from "../data/mypage-mylevel-card.js";

export async function fetchCardStats(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "사용자 ID가 필요합니다." });
    }

    const cardStats = await getCardStats({ id });

    if (!cardStats || cardStats.length === 0) {
      return res.status(404).json({ message: "카드 기록을 찾을 수 없습니다." });
    }

    return res.status(200).json({ data: cardStats });
  } catch (error) {
    console.error("Error fetching card stats:", error);
    return res
      .status(500)
      .json({ error: "카드 데이터를 가져오는 중 오류가 발생했습니다." });
  }
}
