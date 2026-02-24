import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      null: false,
    },
    description: {
      type: String,
      null: false,
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      null: false,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
      null: true,
    },
  },
  {
    timestamps: true,
  },
);

const ticketModel = new mongoose.model("ticket", ticketSchema);
export default ticketModel;
