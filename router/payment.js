import express from "express";
import * as paymentController from "../controller/payment.js";

const router = express.Router();

router.post("/complete", paymentController.completePayment);
router.get("/:id", paymentController.getUserByIdController);

export default router;
