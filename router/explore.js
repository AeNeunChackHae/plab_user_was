import express from 'express';
import { getMatchesByType } from '../controller/explore.js';

const router = express.Router();

// 매치 종류별 라우트
router.get('/:match_code/matches', (req, res) => {
    const { match_code } = req.params;

    // 유효한 match_code인지 확인
    const validMatchCodes = ['1', '2', '3', '4', '5'];
    if (!validMatchCodes.includes(match_code)) {
        return res.status(400).json({
            error: 'Invalid match_code. Please provide a valid match_code (1-5).'
        });
    }

    // 컨트롤러로 요청 전달
    getMatchesByType(match_code, res);
});

export default router;
