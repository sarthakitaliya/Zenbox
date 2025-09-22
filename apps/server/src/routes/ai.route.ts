import express, { Router } from "express";
import { categorizeInitialEmails } from "../controllers/ai.controller";

const router: Router = express.Router();

router.get("/categorize-initial-emails", categorizeInitialEmails)
export default router