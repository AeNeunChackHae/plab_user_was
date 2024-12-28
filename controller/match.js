import * as matchData from '../data/match.js';



// 매치 ID로 매치 정보 조회
export async function matchDetails(req, res) {
    const { match_id } = req.body;
  
    if (!match_id) {
      return res.status(400).json({ message: 'match_id가 제공되지 않았습니다.' });
    }
  
    try {
      const match = await matchData.findByMatchs(match_id);
      // console.log(match)
      if (!match) {
        return res.status(404).json({ message: '해당 매치 ID에 대한 데이터를 찾을 수 없습니다.' });
      }
      res.status(200).json(match);
    } catch (error) {
      console.error('매치 정보 조회 중 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

// match의 Details 컴포넌트
export async function getMatchDetails(req, res) {
  const { match_id } = req.body;

  if (!match_id) {
    return res.status(400).json({ message: "match_id가 필요합니다." });
  }

  try {
    const matchDetails = await matchData.findDetailsById(match_id);
    if (!matchDetails) {
      return res.status(404).json({ message: "매치 정보를 찾을 수 없습니다." });
    }
    res.status(200).json(matchDetails);
  } catch (err) {
    console.error("매치 세부 정보 처리 중 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}


export async function matchPoints(req, res) {
  const { match_id } = req.body;

  if (!match_id) {
    return res.status(400).json({ message: 'match_id가 제공되지 않았습니다.' });
  }

  try {
    const matchPoints = await matchData.findMatchPoints(match_id);
    if (!matchPoints) {
      return res.status(404).json({ message: '해당 매치 ID에 대한 데이터를 찾을 수 없습니다.' });
    }
    res.status(200).json(matchPoints);
  } catch (error) {
    console.error('매치 포인트 조회 중 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}
