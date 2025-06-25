// Routes/upload.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads folder exists
const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.array('images', 6), (req, res) => {
  // Use full deployed backend domain instead of localhost
  const baseUrl = 'https://backendmernestate-production.up.railway.app';

  const urls = req.files.map(file => ({
    url: `${baseUrl}/uploads/${file.filename}`,
    name: file.filename,
  }));

  res.json({ images: urls });
});

export default router;
