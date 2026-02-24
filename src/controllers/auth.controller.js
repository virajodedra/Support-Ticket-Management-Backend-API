import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function LoginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Email and  passwword are  required" });
  }

  try {
    const user = await userModel.findOne({ email }).populate("role_id", "name");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role_id?.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "4h" },
    );

    res.status(200).json({
      message: "Login Done  Sucessfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: " Server error", error });
  }
}

export { LoginUser };
