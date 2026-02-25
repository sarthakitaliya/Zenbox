import express from "express";
import { getFullEmail, getEmails, getRecentEmails, archiveThread, trashThread, starThread, unstarThread, unarchiveThread, sendEmail, replyEmail, downloadAttachment } from "../controllers/emails.controller.js";

const router: express.Router = express.Router();

router.get("/", getEmails);

router.get("/body", getFullEmail);

router.get("/recent", getRecentEmails);

router.post("/archive", archiveThread);

router.post("/unarchive", unarchiveThread);

router.post("/trash", trashThread);

router.post("/star", starThread);

router.post("/unstar", unstarThread);
router.post("/send", sendEmail);
router.post("/reply", replyEmail);
router.get("/attachment", downloadAttachment);

export default router;
