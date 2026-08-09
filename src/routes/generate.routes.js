import express from "express";
import generateCode from "../controllers/generate.controller.js";

const router = express.Router();

router.post("/generate", generateCode);

export default router;