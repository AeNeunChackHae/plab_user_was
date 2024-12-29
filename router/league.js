import express from 'express';
import { fetchFilteredLeagueData } from '../controller/league.js';

const router = express.Router();

router.post('/', fetchFilteredLeagueData);

export default router;