import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  createTicket,
  getTickets,
  deleteTicket,
} from "../controllers/ticket.controller.js";
import { addComment, getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize("USER", "MANAGER"), createTicket);

router.get(
  "/",
  authenticate,
  authorize("MANAGER", "SUPPORT", "USER"),
  getTickets,
);

router.delete("/:id", authenticate, authorize("MANAGER"), deleteTicket);

///COmments route
router.post(
  "/:id/comments",
  authenticate,
  authorize("MANAGER", "SUPPORT", "USER"),
  addComment,
);

router.get(
  "/:id/comments",
  authenticate,
  authorize("MANAGER", "SUPPORT", "USER"),
  getComments,
);

export default router;
