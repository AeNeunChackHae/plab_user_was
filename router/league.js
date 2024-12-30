import express from 'express';
import { fetchFilteredLeagueData, fetchFilteredCompletedTeamMatches, fetchTeamRanking } from '../controller/league.js';

const router = express.Router();

// 진행 예정인 팀 매치 (일정 탭)
router.post('/upcoming', fetchFilteredLeagueData);

// 진행 완료된 팀 매치 (완료 탭)
router.post('/completed', fetchFilteredCompletedTeamMatches);

// 팀 순위 조회 (팀 순위 탭)
router.post('/ranking', fetchTeamRanking);

export default router;