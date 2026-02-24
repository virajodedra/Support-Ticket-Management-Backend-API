import mongoose from "mongoose";

async function connectDB() {
  //   console.log("Temp test mogno uri :::", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connating to MongoDB:", error);
  }
}

export default connectDB;
