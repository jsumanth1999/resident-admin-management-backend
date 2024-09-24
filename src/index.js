import express from "express";
import { connecToMongoDB } from "./db/mongo.js";
import { LoginHandler, RegisterHandler } from "./handlers/auth.js";
import {
  createRequestsHandler,
  deleteRequestsHandler,
  getRequestsByIdHandler,
  listRequestsHandler,
  updateRequestsHandler,
  uploadImages,
} from "./handlers/request.js";
import cors from "cors";
import { getUserByIdHandler, listUsersHandler, updateUsersHandler } from "./handlers/users.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));


app.use(express.static("uploads"));

//Connection to mongodb
connecToMongoDB();

app.post("/api/auth/register", RegisterHandler);
app.post("/api/auth/login", LoginHandler);

//Requests
app.get("/api/requests", listRequestsHandler);
app.get("/api/requests/:id", getRequestsByIdHandler);
app.post("/api/requests", uploadImages, createRequestsHandler);
app.put("/api/requests/:id", updateRequestsHandler);
app.delete("/api/requests/:id", deleteRequestsHandler);

//Users
app.get("/api/users", listUsersHandler);
app.get("/users/me", getUserByIdHandler);
app.put("/users/me", updateUsersHandler);

app.listen(8001, () => {
  console.log("App is running on port 8001...");
});
