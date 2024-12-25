import express from 'express';
import * as stadiumController from '../controller/stadium.js';

const router = express.Router();

router.post('/stadiumPhoto', stadiumController.photoPath)

export default router;
