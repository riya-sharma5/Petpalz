"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const regex_1 = require("../utils/regex");
const message_1 = require("../utils/message");
const uploadFolder = "uploads/";
if (!fs_1.default.existsSync(uploadFolder)) {
    fs_1.default.mkdirSync(uploadFolder);
}
const fileFilter = (_req, file, cb) => {
    const allowedTypes = regex_1.fileRegex;
    const ext = path_1.default.extname(file.originalname).toLowerCase().substring(1);
    if (allowedTypes.test(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error(message_1.ERROR_RESPONSE.fileUploadError));
    }
};
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default.basename(file.originalname, ext).replace(/\s+/g, "_");
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${baseName}_${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});
exports.default = upload;
//# sourceMappingURL=multer.js.map