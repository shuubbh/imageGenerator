import express from "express";
import { generateImage } from "../controllers/GenerateImage.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

router.post("/", generateImage);

export default router;