import express from "express";
const router = express.Router();

import {
  registerUser,
  LoginUser,
  UpdateProfile,
  getAllUsers,
  getOneUserById,
  DeleteUser,
} from "../controllers/userControllers.js";

// routes
router.post("/register", registerUser);
router.post("/login", LoginUser);
router.put("/update/:id", UpdateProfile);
router.get("/users", getAllUsers);
router.get("/user/:id", getOneUserById);
router.delete("/delete/:id", DeleteUser);

export default router;
