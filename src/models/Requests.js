import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      required: true,
    },
    apartmentNo:{
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Requests = mongoose.model("Requests", requestSchema);
