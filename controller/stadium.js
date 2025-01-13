import * as stadiumData from "../data/stadium.js";
import moment from "moment";

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

export async function form(req,res) {
  const formData = req.body;
  const awsUploadPath = req.awsUploadPath;

  formData["photo_path"] = awsUploadPath;
  formData["status_code"] = 0;
  const insertResultId = await stadiumData.insertStadium(formData);

  // 정상 등록
  if(insertResultId) {
    const config_data_arr = getConfigParameterArray(insertResultId, formData);

    const affectedRows = await stadiumData.insertStadiumConfig(config_data_arr);

    if(affectedRows > 0) res.json({status:true, url:'/'});
    else res.json({status:false, error:'----- config insert affectedRows is 0 -----'});
  }
  // INSERT 쿼리 중 에러 발생
  else res.json({status:false})
}

function getConfigParameterArray(stadium_id, formData){
  let flag = false;
  const config_keys = ['match_type_', 'allow_gender_', 'level_criterion_', 'match_start_time_'];
  const config_data_arr = [];
  let num = 0;
  while(true){
    const sql_param = { 'stadium_id':stadium_id }

    // match_type_(num)이 formData에 존재하는지 확인
    config_keys.forEach(item => {
      let name_attribute = item+num // 'match_type_0' ... 'allow_gender_0' ... 
      console.log('name_attribute: ', name_attribute);

      // 존재하는 경우
      if(name_attribute in formData){
        
        let columnName = item.slice(0, -1);
        
        if(columnName !== 'match_start_time'){
          sql_param[columnName] = formData[name_attribute]  // sql_param에 'match_type : 1' 이런 key:value 모양으로 저장
        }else{
          const matchStartTime = moment().clone().set({
            hour: parseInt(formData[name_attribute].split(':')[0]),
            minute: parseInt(formData[name_attribute].split(':')[1]),
            second: 0
          });
          const matchEndTime = matchStartTime.clone().add(2, 'hours');
          const match_start_time = matchStartTime.format('YYYY-MM-DD HH:mm:ss');
          const match_end_time = matchEndTime.format('YYYY-MM-DD HH:mm:ss');
          sql_param['match_start_time'] = match_start_time;
          sql_param['match_end_time'] = match_end_time;
        }
      
      // 없는 경우
      }else{
        flag = true;
      }
    })

    // num번 매치 설정이 없던 경우 (종료)
    if(flag) break;

    // num번 매치 설정이 있던 경우 (다음 매치 설정도 확인)
    else {
      config_data_arr.push(sql_param);
      console.log('config_data_arr: ', config_data_arr);
      num += 1;
    }
  }

  return config_data_arr;
}