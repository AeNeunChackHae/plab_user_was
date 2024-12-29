import express from 'express';
import * as stadiumController from '../controller/stadium.js';

const router = express.Router();

router.post('/stadiumPhoto', stadiumController.photoPath)
router.post("/details", stadiumController.getStadiumDetails);
router.post('/rules', stadiumController.getStadiumRules);
router.post('/getMatches', stadiumController.getMatchesByStadium);
router.post("/match", stadiumController.getStadiumMatchDetails); 
router.post("/feedback", stadiumController.getStadiumFeedback);

export default router;
