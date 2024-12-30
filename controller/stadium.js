import * as stadiumData from "../data/stadium.js";

export async function photoPath(req, res) {
  // console.log('리퀘스트', req.body)
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

export async function getStadiumRules(req, res) {
  const { stadium_id } = req.body;

  if (!stadium_id) {
    return res.status(400).json({ message: "stadium_id가 필요합니다." });
  }

  try {
    const rules = await stadiumData.findStadiumRulesById(stadium_id);
    if (!rules) {
      return res.status(404).json({ message: "경기장을 찾을 수 없습니다." });
    }
    res.status(200).json(rules);
  } catch (error) {
    console.error("Error fetching stadium rules:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}


export async function getStadiumDetails(req, res) {
  // console.log('리퀘스트', req.body)
  const { stadium_id } = req.body;
  // console.log(stadium_id)
  if (!stadium_id) {
    return res.status(400).json({ message: "stadium_id가 필요합니다." });
  }

  try {
    const stadium = await stadiumData.findStadiumById(stadium_id);
    if (!stadium) {
      return res.status(404).json({ message: "경기장을 찾을 수 없습니다." });
    }

    res.status(200).json(stadium);
  } catch (error) {
    console.error("Error fetching stadium details:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

export async function getMatchesByStadium(req, res) {
  const { stadiumId } = req.body;

  if (!stadiumId) {
    return res.status(400).json({ message: 'stadiumId가 필요합니다.' });
  }

  try {
    const matches = await stadiumData.findMatchesByStadiumId(stadiumId);
    // console.log(matches)

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: '해당 경기장의 매치 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

export async function getStadiumMatchDetails(req, res) {
  const { stadiumId } = req.body;

  if (!stadiumId) {
    return res.status(400).json({ message: "Stadium ID가 필요합니다." });
  }

  try {
    const matchDetails = await stadiumData.findStadiumMatchDetails(stadiumId);
    // console.log(stadiumId)

    if (!matchDetails || matchDetails.length === 0) {
      return res.status(404).json({ message: "해당 구장에 대한 매치를 찾을 수 없습니다." });
    }

    res.status(200).json(matchDetails);
  } catch (error) {
    console.error("Error fetching stadium match details:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

export async function getStadiumFeedback(req, res) {
  const { stadiumId } = req.body;

  // console.log("컨트롤러 - stadiumId:", stadiumId);

  if (!stadiumId) {
    return res.status(400).json({ message: "stadiumId가 필요합니다." });
  }

  try {
    const feedback = await stadiumData.findFeedbackByStadiumId(stadiumId);
    // console.log("컨트롤러 결과 - 피드백 데이터:", feedback);

    if (!feedback || (feedback.good.length === 0 && feedback.bad.length === 0)) {
      return res.status(404).json({ message: "리뷰 데이터가 없습니다." });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback in controller:", error);
    res.status(500).json({ message: "리뷰 데이터를 가져오는 중 오류가 발생했습니다." });
  }
}