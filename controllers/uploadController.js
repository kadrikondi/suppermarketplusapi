// userPhotoController.js

import multer from "multer";
import fs from "fs";
import User from "../model/userModel.js";
import config from "../config/config.js";
// cloudinary
import { v2 as cloudinary } from "cloudinary";
// import config from "../config/config.js";
import Supermarket from "../model/supermarketModel.js";

// user upload to local

// Multer setup for uploading photos to the "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolderPath = "./uploads";

    // Check if the "uploads" folder exists, create it if it doesn't
    fs.access(uploadFolderPath, fs.constants.F_OK, (err) => {
      if (err) {
        // "uploads" folder does not exist, create it
        fs.mkdir(uploadFolderPath, (err) => {
          if (err) {
            console.error('Error creating "uploads" folder:', err);
          } else {
            console.log('"uploads" folder created successfully');
            cb(null, uploadFolderPath);
          }
        });
      } else {
        // "uploads" folder already exists
        cb(null, uploadFolderPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png|webp|heic)$/i)) {
    return cb("Only image files are allowed", false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
}).single("pic");
// upload local
export const updateUserPhoto = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading photo:", err);
        return res.status(400).json({ message: "Error uploading photo" });
      }

      if (!req.file) {
        return res.status(403).json({ message: "No file selected" });
      }

      const userImgUrl = "/uploads/" + req.file.filename;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { pic: userImgUrl },
        { new: true }
      );

      return res.status(201).json({
        message: "Profile photo updated",
        user: updatedUser,
      });
    });
  } catch (error) {
    console.error("Update user profile photo error:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
};

// cloudinary upload
// cloudinary

// userPhotoController.js

// Multer setup for uploading photos
const storageC = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadC = multer({
  storage: storageC,
  fileFilter: imageFilter,
}).single("pic");

//  user upload to cloudinary Controller Upload picture

export const updateUserPhotoCloudinary = async (req, res) => {
  try {
    uploadC(req, res, async (err) => {
      if (err) {
        console.error("Error uploading photo:", err);
        return res.status(400).json({ message: "Error uploading photo" });
      }

      if (!req.file) {
        return res.status(403).json({ message: "No file selected" });
      }
      cloudinary.config({
        cloud_name: config.cloud_name || process.env.CLOUD_NAME,
        api_key: config.api_key || process.env.API_KEY,
        api_secret: config.api_secret || process.env.API_SECRET,
      });
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const userImgUrl = result.secure_url;

        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { pic: userImgUrl },
          { new: true }
        );

        return res.status(201).json({
          message: "Profile photo updated",
          user: updatedUser,
        });
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({
          code: "CLOUDINARY_ERROR",
          message: "Error uploading to Cloudinary",
        });
      }
    });
  } catch (error) {
    console.error("Update user profile photo error:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
};

// supermarketController.js
// upload to suppermarket picture local folder
// Multer setup for uploading supermarket pictures
const storageSup = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolderPath = "./uploads/supermarkets";

    // Check if the "supermarkets" folder exists, create it if it doesn't
    fs.access(uploadFolderPath, fs.constants.F_OK, (err) => {
      if (err) {
        // "supermarkets" folder does not exist, create it
        fs.mkdir(uploadFolderPath, (err) => {
          if (err) {
            console.error('Error creating "supermarkets" folder:', err);
          } else {
            console.log('"supermarkets" folder created successfully');
            cb(null, uploadFolderPath);
          }
        });
      } else {
        // "supermarkets" folder already exists
        cb(null, uploadFolderPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imageFilterSup = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
    return cb("Only image files are allowed", false);
  }
  cb(null, true);
};

// Multer middleware for limiting uploads to 5 pictures
const uploadSup = multer({
  storage: storageSup,
  fileFilter: imageFilterSup,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  array: 5, // Limit to 5 files
}).array("images", 5); // Field name for multiple files and maximum number of files

export const uploadSupermarketPictures = async (req, res) => {
  try {
    uploadSup(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ message: "Multer error occurred", error: err });
      } else if (err) {
        // Other error occurred
        console.error("Error uploading pictures:", err);
        return res
          .status(400)
          .json({ message: "Error uploading pictures", error: err });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(403).json({ message: "No files selected" });
      }
      // Fetch user and supermarket based on IDs
      const user = await User.findById(req.params.userId);
      const supermarket = await Supermarket.findById(req.params.supermarketId);

      // Check if user and supermarket exist
      if (!user || !supermarket) {
        return res
          .status(404)
          .json({ message: "User or supermarket not found" });
      }
      console.log(supermarket);
      // Check if the user created the supermarket
      if (supermarket.createdBy.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const supermarketImgUrls = req.files.map(
        (file) => "/uploads/supermarkets/" + file.filename
      );

      // Save supermarket image URLs to the database or perform other actions as needed
      // For example:
      const updatedSupermarket = await Supermarket.findByIdAndUpdate(
        req.params.id,
        { images: supermarketImgUrls },
        { new: true }
      );

      return res.status(201).json({
        message: "Supermarket pictures uploaded successfully",
        supermarket: updatedSupermarket,
        images: supermarketImgUrls,
      });
    });
  } catch (error) {
    console.error("Error uploading supermarket pictures:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
};

// supper maekrt picture
//upload to cloudinary

const storageSupC = multer.memoryStorage();

const imageFilterSupC = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
    return cb("Only image files are allowed", false);
  }
  cb(null, true);
};

// Multer middleware for limiting uploads to 5 pictures
const uploadSupC = multer({
  storage: storageSupC,
  fileFilter: imageFilterSupC,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  array: 5, // Limit to 5 files
}).array("images", 5); // Field name for multiple files and maximum number of fi

export const uploadCloudinarySupermarketPictures = async (req, res) => {
  try {
    uploadSupC(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(400)
          .json({ message: "Multer error occurred", error: err });
      } else if (err) {
        console.error("Error uploading pictures:", err);
        return res
          .status(400)
          .json({ message: "Error uploading pictures", error: err });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(403).json({ message: "No files selected" });
      }

      const user = await User.findById(req.params.userId);
      const supermarket = await Supermarket.findById(req.params.supermarketId);

      if (!user || !supermarket) {
        return res
          .status(404)
          .json({ message: "User or supermarket not found" });
      }

      if (supermarket.createdBy.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const totalImagesAfterUpload = req.files.length;
      if (totalImagesAfterUpload > 5) {
        return res
          .status(400)
          .json({ message: "Cannot upload more than 5 photos" });
      }

      // const totalImagesAfterUpload =
      //   supermarket.images.length + req.files.length;
      // if (totalImagesAfterUpload > 5) {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot upload more than 5 photos" });
      // }
      cloudinary.config({
        cloud_name: config.cloud_name || process.env.CLOUD_NAME,
        api_key: config.api_key || process.env.API_KEY,
        api_secret: config.api_secret || process.env.API_SECRET,
      });
      const uploadedImages = [];
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          });
          stream.end(file.buffer);
        });
      });

      try {
        const imageUrls = await Promise.all(uploadPromises);
        uploadedImages.push(...imageUrls);

        supermarket.images.push(...uploadedImages);
        await supermarket.save();

        return res.status(201).json({
          message: "Supermarket pictures uploaded successfully",
          supermarket,
          images: uploadedImages,
        });
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({
          message: "Error uploading to Cloudinary",
          error: uploadError,
        });
      }
    });
  } catch (error) {
    console.error("Error uploading supermarket pictures:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
};

// export const uploadCloudinarySupermarketPictures = async (req, res) => {
//   try {
//     uploadSupC(req, res, async (err) => {
//       if (err instanceof multer.MulterError) {
//         console.error("Multer error:", err);
//         return res
//           .status(400)
//           .json({ message: "Multer error occurred", error: err });
//       } else if (err) {
//         console.error("Error uploading pictures:", err);
//         return res
//           .status(400)
//           .json({ message: "Error uploading pictures", error: err });
//       }

//       if (!req.files || req.files.length === 0) {
//         return res.status(403).json({ message: "No files selected" });
//       }

//       const user = await User.findById(req.params.userId);
//       const supermarket = await Supermarket.findById(req.params.supermarketId);

//       if (!user || !supermarket) {
//         return res
//           .status(404)
//           .json({ message: "User or supermarket not found" });
//       }

//       if (supermarket.createdBy.toString() !== req.params.userId) {
//         return res.status(403).json({ message: "Unauthorized" });
//       }

//       cloudinary.config({
//         cloud_name: config.cloud_name || process.env.CLOUD_NAME,
//         api_key: config.api_key || process.env.API_KEY,
//         api_secret: config.api_secret || process.env.API_SECRET,
//       });

//       const uploadedImages = [];
//       const uploadPromises = req.files.map((file) => {
//         return new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream((error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result.secure_url);
//             }
//           });
//           stream.end(file.buffer);
//         });
//       });

//       try {
//         const imageUrls = await Promise.all(uploadPromises);
//         uploadedImages.push(...imageUrls);

//         if (supermarket.images.length + uploadedImages.length > 5) {
//           return res
//             .status(400)
//             .json({ message: "Cannot upload more than 5 photos" });
//         }

//         supermarket.images.push(...uploadedImages);
//         await supermarket.save();

//         return res.status(201).json({
//           message: "Supermarket pictures uploaded successfully",
//           supermarket,
//           images: uploadedImages,
//         });
//       } catch (uploadError) {
//         console.error("Error uploading to Cloudinary:", uploadError);
//         return res.status(500).json({
//           message: "Error uploading to Cloudinary",
//           error: uploadError,
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Error uploading supermarket pictures:", error.message);
//     return res.status(500).json({
//       code: "SERVER_ERROR",
//       message: "Something went wrong, please try again",
//     });
//   }
// };
