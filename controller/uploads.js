// routes/images.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Photo = require("../model/photo"); // Import the Photo model
const { requireAuth } = require("../middleware/auth"); // Import the authentication middleware

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create the uploads folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Define the destination folder
  },
  filename: function (req, file, cb) {
    // Define the filename (you can adjust this as needed)
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("photo");

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

// Upload photo
const handleUploads = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ msg: "Error: No file selected!" });
      } else {
        try {
          // Associate uploaded photo with the authenticated user
          //console.log(req);
          const photo = new Photo({
            filename: req.file.filename,
            user: req.user.userId, // Assuming user ID is stored in req.user._id after authentication
          });
          await photo.save();
          res
            .status(200)
            .json({ msg: "File uploaded successfully!", file: req.file });
        } catch (error) {
          res.status(500).json({ msg: "Server Error" });
        }
      }
    }
  });
};

const handleGetPhotoes = async (req, res) => {
  try {
    // Retrieve photos associated with the authenticated user
    // console.log(req);
    const photos = await Photo.find({ user: req.user.userId });

    // const filenames = photos.map(photo => photo.filename);
    // console.log(filenames)
    // res.json(filenames);
    res.status(200).json({ photos });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const handleDeletePhotos = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the photo by ID and delete it
    const deletedPhoto = await Photo.findByIdAndDelete(id);

    if (!deletedPhoto) {
      return res.status(404).json({ message: "Photo not found" });
    }
    console.log(deletedPhoto.filename)
    const filePath = path.join(__dirname, `../uploads/${deletedPhoto.filename}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Synchronously delete the file
    }
    res.json({ message: "Photo deleted successfully", deletedPhoto });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete photo" });
  }
};

module.exports = { handleUploads, handleGetPhotoes , handleDeletePhotos};
