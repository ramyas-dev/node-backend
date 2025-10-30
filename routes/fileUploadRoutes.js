import express from "express";
import { upload, uploadCSV, getFiles, downloadFile, deleteFile } from "../controllers/fileUploadController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const FileUploadRouter = express.Router();

FileUploadRouter.post("/upload-csv",authMiddleware, upload.single("file"), uploadCSV);
FileUploadRouter.get("/files", authMiddleware, getFiles);
FileUploadRouter.get("/download/:id",authMiddleware, downloadFile);
FileUploadRouter.delete("/delete/:id",authMiddleware, deleteFile);

export default FileUploadRouter;
