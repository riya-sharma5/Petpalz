"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaceValidation = exports.updatePlaceValidation = exports.getPlaceByIdValidation = exports.getPlacesValidation = exports.addPlaceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addPlaceValidation = joi_1.default.object({});
exports.getPlacesValidation = joi_1.default.object({});
exports.getPlaceByIdValidation = joi_1.default.object({});
exports.updatePlaceValidation = joi_1.default.object({});
exports.deletePlaceValidation = joi_1.default.object({});
//# sourceMappingURL=placesValidation.js.map