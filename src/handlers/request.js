import { Requests } from "../models/Requests.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage });

export const uploadImages = upload.array("images", 4);

export const listRequestsHandler = async (req, res) => {
  const { authorization } = req.headers;
  let _id;
  let role;

  if (!authorization) {
    return res.status(400).json({
      message: "Token is missing",
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

  const fetchRequests = async (role, userId) => {
    try {
      console.log(userId, role);
      const data =
        role === "admin"
          ? await Requests.find({})
          : await Requests.find({ userId });

      return data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  };

  const data = await fetchRequests(role, _id);

  return res.status(200).json({
    message: "Requests listed successfully...",
    data,
  });
};

export const createRequestsHandler = async (req, res) => {
  const { authorization } = req.headers;
  let userId;

  if (!authorization) {
    return res.status(404).json({
      message: "Token is missing",
    });
  }
  console.log(authorization);

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
    console.log(payload);
    userId = payload._id;
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Expired",
    });
  }
  const { title, description, status, apartmentNo } = req.body;

  const imageFileNames = req.files.map((file) => file.filename);

  if (!title || !description || !apartmentNo) {
    return res.status(400).json({
      message: "Please enter required fields",
    });
  }

  await Requests.create({
    userId,
    title,
    description,
    apartmentNo,
    status,
    images: imageFileNames,
  });

  return res.status(200).json({
    message: "Request Created Successfully...",
  });
};

export const updateRequestsHandler = async (req, res) => {
  const { authorization } = req.headers;
  let role;

  if (!authorization) {
    return res.status(400).json({
      message: "Token is missing",
    });
  }

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
    role = payload.role;
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Expired",
    });
  }

  const { id } = req.params;
  const { status, description } = req.body;

  if (role === "resident") {
    return res.status(400).json({
      message: "Resident has not access to update",
    });
  }

  const updatedData = await Requests.findByIdAndUpdate(
    id,
    {
      status,
      description,
    },
    { new: true }
  );

  return res.status(200).json({
    message: "Admin updated Successfully..",
    updatedData,
  });
};

export const getRequestsByIdHandler = async(req,res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      message: "Token is missing",
    });
  }

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Expired",
    });
  }

  const { id } = req.params;
  const data = await Requests.findById(id);

  if(!data){
    return res.status(400).json({
      message: "Request is not exists..",
    })
  }

  return res.status(200).json({
    message: "listed successfully",
    data
  })
}

export const deleteRequestsHandler = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({
      message: "Token is missing",
    });
  }

  try {
    const payload = jwt.verify(authorization, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).json({
      message: "Token is Invalid or Expired",
    });
  }

  const { id } = req.params;
  const data = await Requests.findByIdAndDelete(id);

  if (!data) {
    return res.status(400).json({
      message: "Id is not exists to delete",
    });
  }

  return res.status(200).json({
    message: "Request is deleted successfully...",
  });
};
