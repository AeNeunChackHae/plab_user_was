import express from 'express';
import * as matchController from '../controller/match.js';
import { isAuth } from '../middleware/auth.js'

const router = express.Router();

router.post('/', matchController.matchDetails)
router.post('/points', matchController.matchPoints)
router.post("/match-data", matchController.matchLevelStats)
router.post("/stadium-info", matchController.getStadiumInfo)
router.post("/team-preview", matchController.getTeamData);
router.post("/results", matchController.getTeamsForMatch);
router.post('/apply', isAuth, matchController.applyForMatch);
router.post('/details', matchController.getMatchDetails)
router.post("/blacklist-check", matchController.blacklistCheck);
router.post("/team-check", matchController.teamCheck);
router.post('/application-check', matchController.checkApplicationStatusHandler);
router.post("/apply", matchController.applyForMatch);




export default router;
