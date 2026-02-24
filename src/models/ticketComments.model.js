import mongoose from "mongoose";

const ticketCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      null: false,
    },
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const ticketModel = new mongoose.model("ticketComment", ticketCommentSchema);
export default ticketModel;
