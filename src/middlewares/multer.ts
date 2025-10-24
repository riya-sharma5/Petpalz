import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { fileRegex } from "../utils/regex";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";


const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = fileRegex;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(ERROR_RESPONSE.fileUploadError));
  }
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${baseName}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default upload;
