import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/createUser.route.js";
import ticketRouter from "./routes/ticket.route.js";
import commentRouter from "./routes/comment.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/tickets", ticketRouter);
app.use("/comments", commentRouter);

export default app;
