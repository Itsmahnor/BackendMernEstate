// routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create uploads folder if not exists
const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

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

router.post('/upload', upload.array('images', 6), (req, res) => {
  const urls = req.files.map(file => ({
    url: `http://localhost:3000/uploads/${file.filename}`,
    name: file.filename,
  }));
  res.json({ images: urls });
});

export default router;
