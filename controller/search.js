import { searchStadiums } from "../data/search.js";

export const getStadiums = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "검색어를 입력해주세요." });
  }

  try {
    const results = await searchStadiums(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching stadiums:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
