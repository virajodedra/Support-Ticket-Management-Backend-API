import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import roleModel from "../models/role.model.js";

async function createUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "name, email , passward and role are   not provided" });
  }

  const validRoles = ["MANAGER", "SUPPORT", "USER"];
  const trimUpperCaseRole = role.trim().toUpperCase();
  if (!validRoles.includes(trimUpperCaseRole)) {
    return res
      .status(400)
      .json({ message: "role must be one of: MANAGER, SUPPORT, USERs" });
  }

  try {
    const roleDoc = await roleModel.findOne({ name: trimUpperCaseRole });
    if (!roleDoc) {
      return res
        .status(400)
        .json({ message: `Role '${trimUpperCaseRole}' not found in DB` });
    }

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already taken choose another one" });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    console.log(`:::::: Sault rounds :::${saltRounds} ::`);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role_id: roleDoc._id,
    });

    return res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: {
        id: roleDoc._id,
        name: roleDoc.name,
      },
      created_at: newUser.createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await userModel.find().populate("role_id", "name");

    const result = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: {
        id: u.role_id?._id ?? null,
        name: u.role_id?.name ?? null,
      },
      created_at: u.createdAt,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal serverer error", error: error.message });
  }
}

export { createUser, listUsers };
