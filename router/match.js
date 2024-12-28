import express from 'express';
import * as matchController from '../controller/match.js';

const router = express.Router();

router.post('/', matchController.matchDetails)
router.post('/details', matchController.getMatchDetails)
router.post('/points', matchController.matchPoints)


export default router;
