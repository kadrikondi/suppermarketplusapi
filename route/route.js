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
import {
  updateUserPhoto,
  uploadCloudinarySupermarketPictures,
  uploadSupermarketPictures,
  updateUserPhotoCloudinary,
} from "../controllers/uploadController.js";

// user routes
router.post("/register", registerUser);
router.post("/login", LoginUser);
router.put("/update/:id", UpdateProfile);
router.get("/users", getAllUsers);
router.get("/user/:id", getOneUserById);
router.delete("/delete/:id", DeleteUser);
router.put("/user/updateprofile/:id", updateUserPhotoCloudinary);
router.put("/user/updatephoto/:id", updateUserPhoto);

// suppermakert route
// api name can be random anything you want
router.post("/apiv1/registersupermarket/:id", createSupermarket);
router.put("/apiv1/updatesupermarket/:id", updateSupermarket);
router.get("/apiv1/allsuppermarket", getAllSupermarkets);
router.get("/apiv1/suppermarket/:id", getOneSupermarketById);
router.delete("/apiv1/suppermarket:id", deleteSupermarket);
router.put(
  "/apiv1/suppermarket/:userId/:supermarketId",
  uploadSupermarketPictures
);
router.put(
  "/apiv1/suppermarket/supphotoscloud/:userId/:supermarketId",
  uploadCloudinarySupermarketPictures
);

export default router;
