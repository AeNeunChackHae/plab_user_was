import express from 'express';
import { showFilteredMatches } from '../controller/main.js';

const router = express.Router();

router.post('/', showFilteredMatches);

export default router;