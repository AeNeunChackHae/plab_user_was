import express from 'express';
import * as matchController from '../controller/match.js';

const router = express.Router();

router.post('/', matchController.matchDetails)
router.post('/details', matchController.getMatchDetails)
router.post('/points', matchController.matchPoints)
router.post("/match-data", matchController.matchLevelStats)
router.post("/stadium-info", matchController.getStadiumInfo)
router.post("/team-preview", matchController.getTeamData);
router.post("/results", matchController.getTeamsForMatch);


export default router;
