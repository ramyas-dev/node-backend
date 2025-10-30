// controllers/fileUploadController.js
import db from "../models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { parse } from "csv-parse";
import bcrypt from "bcrypt";

const { User, FileMaster } = db;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

export const upload = multer({ storage });

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const rows = [];

    parse(fileContent, { columns: true, skip_empty_lines: true }, async (err, data) => {
      if (err) {
        console.error("CSV parse error:", err);
        return res.status(500).json({ error: "Failed to parse CSV" });
      }

      // Map CSV rows to User objects
      const usersData = await Promise.all(
        data.map(async (row) => ({
          name: row.name,
          email: row.email,
          phone: row.phone,
          age: row.age ? parseInt(row.age) : null,
          gender: row.gender,
          message: row.message,
          password: row.password ? await bcrypt.hash(row.password, 10) : null,
          role: row.role ? parseInt(row.role) : 1,
        }))
      );

      await User.bulkCreate(usersData);

      const fileRecord = await FileMaster.create({
        filename: req.file.originalname,
        file_path: filePath,
        records_count: usersData.length,
        upload_time: new Date(),
        uploaded_by: req.user?.id || null,
        status: "success",
      });

      res.status(201).json({ message: "CSV uploaded", file: fileRecord });
    });
  } catch (err) {
    console.error("CSV upload error:", err);
    res.status(500).json({ error: "Failed to upload CSV" });
  }
};

// Get all uploaded files
export const getFiles = async (req, res) => {
  try {
    const files = await FileMaster.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "name", "email"]
        }
      ]
    },
      { order: [["upload_time", "DESC"]] });
    res.json(files);
  } catch (err) {
    console.error("Fetch files error:", err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};


// Download CSV by ID
export const downloadFile = async (req, res) => {
  try {
    const file = await FileMaster.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.download(file.file_path, file.filename);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
};

// Delete CSV by ID
export const deleteFile = async (req, res) => {
  try {
    const file = await FileMaster.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    // Delete physical file
    if (fs.existsSync(file.file_path)) fs.unlinkSync(file.file_path);

    // Delete DB record
    await FileMaster.destroy({ where: { id: req.params.id } });

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
