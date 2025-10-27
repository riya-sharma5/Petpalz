"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePetValidation = exports.updatePetValidation = exports.addPetValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addPetValidation = joi_1.default.object({
    petName: joi_1.default.string().required(),
    species: joi_1.default.string().required(),
    breed: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    dateOfBirth: joi_1.default.string().optional(),
    age: joi_1.default.string().optional(),
    userId: joi_1.default.string().required(),
});
exports.updatePetValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
    petName: joi_1.default.string().optional(),
    species: joi_1.default.string().optional(),
    breed: joi_1.default.string().optional(),
    gender: joi_1.default.string().optional(),
    dateOfBirth: joi_1.default.date().optional(),
    age: joi_1.default.string().optional(),
});
exports.deletePetValidation = joi_1.default.object({
    id: joi_1.default.string().required(),
    userId: joi_1.default.string().required(),
});
//# sourceMappingURL=petValidation.js.map