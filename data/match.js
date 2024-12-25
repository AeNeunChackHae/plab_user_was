import { db } from '../mysql.js'
import { matchQuery } from '../query/match.js'


export async function findByMatchs(match_id){
    return db.execute(matchQuery.selectMatchByMatchs, [match_id])
    .then((result) => result[0][0])
}

export async function findDetailsById(match_id) {
    return db.execute(matchQuery.joinMatchAndStaddium, [match_id])
      .then((result) => result[0][0])
}

export async function findMatchPoints(match_id) {
    return db
      .execute(matchQuery.joinMatchAndManager, [match_id])
      .then((result) => result[0][0]);
  }