import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.delete(
  "/:id",
  authenticate,
  authorize("MANAGER", "SUPPORT", "USER"),
  deleteComment,
);

export default router;
