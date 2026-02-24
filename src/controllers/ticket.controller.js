import ticketModel from "../models/ticket.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

function formatUserObject(ticketCreator) {
  if (!ticketCreator) return null;
  return {
    id: ticketCreator._id,
    name: ticketCreator.name,
    email: ticketCreator.email,
    role: {
      id: ticketCreator.role_id?._id ?? null,
      name: ticketCreator.role_id?.name ?? null,
    },
    created_at: ticketCreator.createdAt,
  };
}

async function createTicket(req, res) {
  const { title, description, priority } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "title and description is not provided" });
  }
  if (title.length < 5) {
    return res
      .status(400)
      .json({ message: "title should be at least 5 characters long" });
  }
  if (description.length < 10) {
    return res
      .status(400)
      .json({ message: "description should be at least 10 characters long" });
  }

  const validPriorities = ["LOW", "MEDIUM", "HIGH"];
  const isValidPriority = validPriorities.includes(
    priority.trim().toUpperCase(),
  );
  if (priority && !isValidPriority) {
    return res
      .status(400)
      .json({ message: "priority must be LOW, MEDIUM , HIGH" });
  }

  try {
    const ticket = await ticketModel.create({
      title,
      description,
      priority: priority || "MEDIUM",
      createdBy: req.user.id,
    });

    await ticket.populate({
      path: "createdBy",
      populate: { path: "role_id", select: "name" },
    });

    return res.status(201).json({
      id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      created_by: {
        id: ticket.createdBy._id,
        name: ticket.createdBy.name,
        email: ticket.createdBy.email,
        role: {
          id: ticket.createdBy.role_id?._id ?? null,
          name: ticket.createdBy.role_id?.name ?? null,
        },
        created_at: ticket.createdBy.createdAt,
      },
      assigned_to: null,
      created_at: ticket.createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function deleteTicket(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }

  try {
    const ticket = await ticketModel.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function getTickets(req, res) {
  try {
    let filter = {};

    if (req.user.role === "SUPPORT") {
      filter = { assignedTo: req.user.id };
    } else if (req.user.role === "USER") {
      filter = { createdBy: req.user.id };
    }

    const tickets = await ticketModel
      .find(filter)
      .populate({
        path: "createdBy", //ROle
        populate: { path: "role_id", select: "name" },
      })
      .populate({
        path: "assignedTo",
        populate: { path: "role_id", select: "name" },
      })
      .sort({ createdAt: -1 });

    const result = tickets.map((t) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      created_by: formatUserObject(t.createdBy),
      assigned_to: formatUserObject(t.assignedTo),
      created_at: t.createdAt,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export { createTicket, getTickets, deleteTicket };
