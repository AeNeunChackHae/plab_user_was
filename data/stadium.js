import { db } from '../mysql.js'
import { stadiumQuery } from '../query/stadium.js'
import { config } from "../config.js";

export async function findByPhoto(stadium_id) {
    return db.execute(stadiumQuery.selectstadiumByPhotopath, [stadium_id])
        .then((result) => result[0][0])
}

export async function findStadiumRulesById(stadium_id) {
    return db.execute(stadiumQuery.findRulesByStadiumId, [stadium_id]).then(([rows]) => {
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    });
  }

export async function findMatchesByStadiumId(stadiumId) {
    return db
        .execute(stadiumQuery.findMatchesByStadiumId, [stadiumId])
        .then(([rows]) => {
        if (rows.length === 0) {
            return null; // 데이터가 없는 경우 null 반환
        }
        
        // 구장 정보 (첫 번째 행 기준)
        const stadiumInfo = {
            width: rows[0].width,
            height: rows[0].height,
            ground_type_name:
            config.stadium_match.ground_type_code[rows[0].ground_type] || "알 수 없음",
        };

        // 매치 데이터 배열
        const matches = rows.map((row) => ({
            matchId: row.matchId,
            date: row.date,
            time: row.time,
        }));

        // 객체 형태로 반환
        return {
            stadium: stadiumInfo,
            matches,
        };
    });
}

export async function findStadiumById(stadium_id) {
    return db.execute(stadiumQuery.findStadiumById, [stadium_id]).then(([rows]) => {
      if (rows.length === 0) {
        return null;
      }
  
      const stadium = rows[0];
      // console.log("stadium.main_region:", stadium.main_region, typeof stadium.main_region);
      // console.log("config.region.main_region_code:", config.region.main_region_code);
      // console.log('config.region.main_region_code',config.region.main_region_code)
      // console.log('config.region.main_region_code[stadium.main_region] ',config.region.main_region_code[stadium.main_region] )
      
      // main_region 및 sub_region 매핑
      const mainRegionName =
        config.region.main_region_code[stadium.main_region] || "알 수 없음";
      const subRegionName =
        config.region.region_seoul_code[stadium.sub_region] || "알 수 없음";

      // console.log('mainRegionName:',mainRegionName)
      // console.log('subRegionName:',subRegionName)
  
      return {
        ...stadium,
        main_region_name: mainRegionName,
        sub_region_name: subRegionName,
      };
    });
  }

  export async function findStadiumMatchDetails(stadiumId) {
    // console.log("데이터 찾기 시작 - stadiumId:", stadiumId);
    // console.log("Gender Config:", config.stadium_match.match_gender_type_code);
    // console.log("Level Config:", config.stadium_match.match_level_limit_code);

    return db.execute(stadiumQuery.findStadiumMatchDetails, [stadiumId])
      .then(([rows]) => {
        if (rows.length === 0) {
          console.log("데이터가 없습니다.");
          return [];
        }

        return rows.map((row) => {
          // allow_gender와 level_criterion을 매핑
          const allowGender = config.stadium_match.match_gender_type_code[row.allow_gender] || "알 수 없음";
          const levelCriterion = config.stadium_match.match_level_limit_code[row.level_criterion] || "알 수 없음";

          return {
            ...row,
            allow_gender: allowGender,
            level_criterion: levelCriterion,
          };
        });
      })
      .catch((error) => {
        console.error("Error in findStadiumMatchDetails:", error);
        throw error;
      });
}


export async function findFeedbackByStadiumId(stadiumId) {
    // console.log("SQL 실행 - stadiumId:", stadiumId);
  
    return db.execute(stadiumQuery.findFeedbackByStadiumId, [stadiumId])
      .then(([rows]) => {
        // console.log("SQL 결과:", rows);
  
        if (rows.length === 0) {
          console.log("피드백 데이터 없음");
          return { good: [], bad: [] };
        }
  
        const goodFeedback = rows
          .filter((row) => row.feedback_type === 0)
          .map((row) => ({
            feedback: config.stadium_match.positive_feedback_code[row.feedback] || "알 수 없음",
            count: row.count,
          }))
          .sort((a, b) => b.count - a.count) // 내림차순 정렬
          .slice(0, 3); // 상위 3개
  
        const badFeedback = rows
          .filter((row) => row.feedback_type === 1)
          .map((row) => ({
            feedback: config.stadium_match.negative_feedback_code[row.feedback] || "알 수 없음",
            count: row.count,
          }))
          .sort((a, b) => b.count - a.count) // 내림차순 정렬
          .slice(0, 3); // 상위 3개
  
        // console.log("가공된 긍정 피드백:", goodFeedback);
        // console.log("가공된 부정 피드백:", badFeedback);
  
        return {
          good: goodFeedback.map((item) => item.feedback),
          bad: badFeedback.map((item) => item.feedback),
        };
      })
      .catch((error) => {
        console.error("Error in findFeedbackByStadiumId:", error);
        throw error;
      });
  }
  