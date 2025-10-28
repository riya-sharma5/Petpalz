"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
const likesRoutes_1 = __importDefault(require("./likesRoutes"));
const petRoutes_1 = __importDefault(require("./petRoutes"));
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const commentsRoutes_1 = __importDefault(require("./commentsRoutes"));
const router = (0, express_1.Router)();
router.use("/user", userRoutes_1.default);
router.use("/post", postRoutes_1.default);
router.use("/likes", likesRoutes_1.default);
router.use("/comments", commentsRoutes_1.default);
router.use("/pets", petRoutes_1.default);
router.use("/chat", chatRoutes_1.default);
exports.default = router;
//# sourceMappingURL=routev1.js.map