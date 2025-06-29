import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import process from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Temporarily allow all origins - no CORS restrictions
app.use(cors());

// Serve static files from the "upload" folder (singular)
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config - save files in "upload" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is live");
});

// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const host = req.get("host");
  const protocol = req.protocol;
  const imageUrl = `${protocol}://${host}/upload/${req.file.filename}`;

  res.json({ imageUrl });
});

// Error handling middleware (must have 4 params)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
