import express from "express";

import createApiKey, {
    getApiKey
} from "../controllers/apiKey.controller.js";

const router = express.Router();

router.post("/new", createApiKey);

router.get("/check", getApiKey);

export default router;