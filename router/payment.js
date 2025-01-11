import express from "express";
import * as paymentController from "../controller/payment.js";
import { isAuth } from '../middleware/auth.js'

const router = express.Router();

router.post("/complete", paymentController.completePayment);
router.get("/:id", paymentController.getUserByIdController);
router.post("/apply-validation", isAuth, paymentController.applyForMatchWithValidation);
// router.post('/apply-simple', isAuth, paymentController.applyForMatchSimple);

export default router;
