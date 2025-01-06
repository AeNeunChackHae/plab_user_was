import express from "express";
import { getFAQsHandler, postFAQHandler } from "../controller/cs.js";

const router = express.Router();

router.get("/faq", getFAQsHandler);
router.post("/faq", postFAQHandler);

export default router;
