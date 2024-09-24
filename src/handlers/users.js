import { Users } from "../models/Users.js";
import jwt from "jsonwebtoken";

export const listUsersHandler = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      message: "Token is missig",
    });
  }

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
    console.log(payload);
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Expired.",
    });
  }

  const data = await Users.find({});

  return res.status(200).json({
    message: "Users Listed Successfully...",
    data,
  });
};

export const getUserByIdHandler = async (req, res) => {
  const { authorization } = req.headers;
  let _id;
  let role;
  if (!authorization) {
    return res.status(400).json({
      message: "Token is missing.",
    });
  }

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
    ({ _id, role } = payload);
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Expired",
    });
  }

  const data = await Users.findById(_id);

  if (!data) {
    return res.status(400).json({
      message: "User not exists",
    });
  }

  return res.status(200).json({
    message: "User listed successfully...",
    data,
  });
};

export const updateUsersHandler = async (req, res) => {
  const { authorization } = req.headers;
  let id;
  let role;

  if (!authorization) {
    return res.status(400).json({
      message: "Token is missing",
    });
  }

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
    ({ _id : id } = payload);
    console.log(id);
    
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Missing",
    });
  }
  const { name, email, apartmentNo } = req.body;

  if(!name || !email || !apartmentNo){
    return res.status(400).json({
        message: "Please enter required fields",
    })
  }

  console.log(id);
  

  const updatedData = await Users.findByIdAndUpdate(
    id,
    {
      name,
      email,
      apartmentNo,
    },
    { new: true }
  );

  return res.status(200).json({
    message: "User Updated Successfully...",
    updatedData,
  })
};
