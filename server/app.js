const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint to handle image uploads
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Upload endpoint hit");
  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ success: 1, file: { url: fileUrl } });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error handling middleware:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
