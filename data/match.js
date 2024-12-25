import { db } from '../mysql.js'
import { matchQuery } from '../query/match.js'

export async function findByPhoto(photo_path) {
    return db.execute(matchQuery.selectstadiumByPhotopath, [photo_path])
        .then((result) => result[0][0])
}

