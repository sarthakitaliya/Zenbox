import express from "express";
import {
  getMyLatestFeedback,
  submitFeedback,
} from "../controllers/feedback.controller";

const router: express.Router = express.Router();

router.post("/", submitFeedback);
router.get("/latest", getMyLatestFeedback);

export default router;
