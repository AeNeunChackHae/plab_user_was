import express from 'express';
import * as matchController from '../controller/match.js';

const router = express.Router();

router.get('/stadiumPhoto', matchController.photoPath);

export default router;
