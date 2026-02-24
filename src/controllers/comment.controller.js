import ticketCommentModel from "../models/ticketComments.model.js";
import ticketModel from "../models/ticket.model.js";
import mongoose from "mongoose";

async function addComment(req, res) {
  const { id } = req.params;
  const { comment } = req.body;
  const { role, id: userId } = req.user;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "comment is required" });
  }

  try {
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (role === "SUPPORT" && String(ticket.assignedTo) !== String(userId)) {
      return res.status(403).json({
        message:
          "Forbidden: you are not the one who is assigned to this ticket",
      });
    }

    // user  potanij ticket par comment kari shake, bijani ticket par naiiii
    if (role === "USER" && String(ticket.createdBy) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Forbidden: you did not created this ticket" });
    }

    const newComment = await ticketCommentModel.create({
      comment,
      ticket_id: id,
      user_id: userId,
    });

    await newComment.populate({
      path: "user_id",
      populate: { path: "role_id", select: "name" },
    });

    const u = newComment.user_id;
    return res.status(201).json({
      id: newComment._id,
      comment: newComment.comment,
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: {
          id: u.role_id?._id ?? null,
          name: u.role_id?.name ?? null,
        },
        created_at: u.createdAt,
      },
      created_at: newComment.createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function getComments(req, res) {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }

  try {
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // SUPPORT potanij assigned ticket par comment kari shake, bijani ticket par naiiii
    if (role === "SUPPORT" && String(ticket.assignedTo) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Forbidden: you are not assigned to this ticket" });
    }
    if (role === "USER" && String(ticket.createdBy) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Forbidden: you did not create this ticket" });
    }

    const comments = await ticketCommentModel
      .find({ ticket_id: id })
      .populate({
        path: "user_id",
        populate: { path: "role_id", select: "name" },
      })
      .sort({ createdAt: 1 });

    const result = comments.map((c) => {
      const u = c.user_id;
      return {
        id: c._id,
        comment: c.comment,
        user: {
          id: u?._id ?? null,
          name: u?.name ?? null,
          email: u?.email ?? null,
          role: {
            id: u?.role_id?._id ?? null,
            name: u?.role_id?.name ?? null,
          },
          created_at: u?.createdAt ?? null,
        },
        created_at: c.createdAt,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function deleteComment(req, res) {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    const comment = await ticketCommentModel.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = String(comment.user_id) === String(userId);
    if (role !== "MANAGER" && !isAuthor) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can only delete your own comments" });
    }

    await ticketCommentModel.findByIdAndDelete(id);
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "International server error", error: error.message });
  }
}

export { addComment, getComments, deleteComment };
