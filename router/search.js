import express from "express";
import { getStadiums } from "../controller/search.js";

const router = express.Router();

router.get("/", getStadiums);

export default router;
