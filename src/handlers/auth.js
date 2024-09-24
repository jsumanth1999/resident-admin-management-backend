import { Users } from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const RegisterHandler = async (req, res) => {
  const { name, email, password, role, apartmentNo } = req.body;

  if (!name || !email || !password || !role || !apartmentNo) {
    return res.status(400).json({
      message: "Please, Enter Required Fields.",
    });
  }

  const existingUser = await Users.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists, Please Login...",
    });
  }

  const saltrounds = 10;

  const encryptedPassword = await bcrypt.hash(password, saltrounds);

  const register = await Users.create({
    name,
    email,
    password: encryptedPassword,
    role,
    apartmentNo,
  });

  return res.status(200).json({
    message: "User registered successfully..",
    register,
  });
};

export const LoginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please, Enter required fields.",
    });
  }

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid crendentials.",
    });
  }
  const { _id, role } = user;

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({
      message: "Invalid crendentials.",
    });
  }

  const token = jwt.sign({ _id, role }, "Resident123@", { expiresIn: "1h" });
  console.log(_id, role);

  

  return res.status(200).json({
    message: "User login successfully...",
    token,
    user
  });
};
