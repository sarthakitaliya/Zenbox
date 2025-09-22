import express, { Router } from "express";
import { googleAuth, googleCallback } from "../controllers/auth.controller";

const router: Router = express.Router();

router.get("/connect-account", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
