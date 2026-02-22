import express from "express";
import {
  getAdminMe,
  getAdminRegistrationStatus,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/adminAuth.controller";
import { deleteUser, listUsers } from "../controllers/adminUsers.controller";
import { getOverviewStats } from "../controllers/adminStats.controller";
import { adminAuthMiddleware } from "../middleware/adminAuth.middleware";

const router: express.Router = express.Router();

router.get("/auth/setup-status", getAdminRegistrationStatus);
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);
router.post("/auth/logout", adminAuthMiddleware, logoutAdmin);
router.get("/auth/me", adminAuthMiddleware, getAdminMe);

router.get("/stats/overview", adminAuthMiddleware, getOverviewStats);
router.get("/users", adminAuthMiddleware, listUsers);
router.delete("/users/:userId", adminAuthMiddleware, deleteUser);

export default router;
