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
import {
  createSupermarket,
  getAllSupermarkets,
  getOneSupermarketById,
  updateSupermarket,
  deleteSupermarket,
} from "../controllers/suppermarketController.js";

// user routes
router.post("/register", registerUser);
router.post("/login", LoginUser);
router.put("/update/:id", UpdateProfile);
router.get("/users", getAllUsers);
router.get("/user/:id", getOneUserById);
router.delete("/delete/:id", DeleteUser);

// suppermakert route
// api name can be random anything you want
router.post("/apiv1/registersupermarket/:id", createSupermarket);
router.put("/apiv1/updatesupermarket/:id", updateSupermarket);
router.get("/apiv1/allsuppermarket", getAllSupermarkets);
router.get("/apiv1/suppermarket/:id", getOneSupermarketById);
router.delete("apiv1/suppermarket:id", deleteSupermarket);

export default router;
