import express, { Router } from "express";
import { categorizeInitialEmails, summarizeEmail } from "../controllers/ai.controller";

const router: Router = express.Router();

router.get("/categorize-initial-emails", categorizeInitialEmails)
router.post("/summarize-email", summarizeEmail);
export default router
