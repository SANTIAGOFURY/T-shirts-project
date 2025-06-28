const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

// Allow only your Vercel frontend and localhost for dev
const allowedOrigins = [
  "https://t-shirts-project-two.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Health check
app.get("/", (req, res) => res.send("Backend is live"));

// Image upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const host = req.get("host");
  const protocol = req.protocol;
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

  res.json({ imageUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
