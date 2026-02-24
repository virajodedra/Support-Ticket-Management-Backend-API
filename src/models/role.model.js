import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["MANAGER", "SUPPORT", "USER"],
    unique: true,
    default: "USER",
    null: false,
  },
});

const roleModel = new mongoose.model("role", roleSchema);
export default roleModel;
