import { db } from '../mysql.js'
import { stadiumQuery } from '../query/stadium.js'

export async function findByPhoto(stadium_id) {
    return db.execute(stadiumQuery.selectstadiumByPhotopath, [stadium_id])
        .then((result) => result[0][0])
}


