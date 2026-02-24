import mongoose from "mongoose";

const ticketStatusLogSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket",
      required: true,
    },
    oldStatus: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      null: false,
    },
    newStatus: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      null: false,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      null: true,
    },
  },
  {
    timestamps: true,
  },
);

const ticketStatusLogsSchemaModel = new mongoose.model(
  "ticketStatusLog",
  ticketStatusLogSchema,
);

export default ticketStatusLogsSchemaModel;
