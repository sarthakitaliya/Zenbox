import express from "express";
import { submitFeedback } from "../controllers/feedback.controller";

const router: express.Router = express.Router();

router.post("/", submitFeedback);

export default router;
