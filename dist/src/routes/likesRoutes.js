"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likesValidation_1 = require("../validations/likesValidation");
const likesControllers_1 = require("../controllers/likesControllers");
const userValidation_1 = require("../validations/userValidation");
const router = express_1.default.Router();
router.post("/like-unlike", (0, userValidation_1.validateRequest)(likesValidation_1.entityValidation), likesControllers_1.likeUnlikeEntity);
exports.default = router;
//# sourceMappingURL=likesRoutes.js.map