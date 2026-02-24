import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      null: false,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      null: false,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      null: false,
      required: true,
      trim: true,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      null: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = new mongoose.model("user", userSchema);
export default userModel;
