import express from "express";
import { createUser, listUsers } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("MANAGER"), createUser);

router.get("/", authenticate, authorize("MANAGER"), listUsers);

export default router;
