import * as matchData from '../data/match.js';

export async function photoPath(req, res) {
    const { photo_path } = req.query;

    if (!photo_path) {
        return res.status(400).json({ message: "photo_path가 제공되지 않았습니다." });
    }

    try {
        const stadium = await matchData.findByPhoto(photo_path);
        if (!stadium) {
            return res.status(404).json({ message: "해당 사진 경로에 대한 경기장을 찾을 수 없습니다." });
        }
        res.status(200).json(stadium);
    } catch (error) {
        console.error("경기장 정보 조회 중 오류:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
}
