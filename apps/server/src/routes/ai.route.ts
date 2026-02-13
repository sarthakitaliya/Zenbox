import express, { Router } from "express";
import {
  categorizeInitialEmails,
  summarizeEmail,
  generateEmailBody,
} from "../controllers/ai.controller";

const router: Router = express.Router();

router.get("/categorize-initial-emails", categorizeInitialEmails)
router.post("/summarize-email", summarizeEmail);
router.post("/generate-email-body", generateEmailBody);
export default router
