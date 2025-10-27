"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPetsByUser = exports.getAllPets = exports.deletePet = exports.updatePet = exports.addPet = void 0;
const petModel_1 = __importDefault(require("../models/petModel"));
const enum_1 = require("../utils/enum");
const dotenv_1 = __importDefault(require("dotenv"));
const message_1 = require("../utils/message");
dotenv_1.default.config();
const addPet = async (req, res, next) => {
    try {
        const { petName, species, breed, gender, dateOfBirth, age, userId } = req.body;
        if (!Object.values(enum_1.Gender).includes(gender)) {
            return res
                .status(400)
                .json({ code: 400, message: message_1.ERROR_RESPONSE.invalidInput });
        }
        if (!Object.values(enum_1.Species).includes(species)) {
            return res
                .status(400)
                .json({ code: 400, message: message_1.ERROR_RESPONSE.invalidInput });
        }
        const pet = await petModel_1.default.create({
            petName,
            species,
            breed,
            gender,
            dateOfBirth,
            age,
            userId,
        });
        return res.status(201).json({
            code: 201,
            message: message_1.SUCCESS_RESPONSE.petAdded,
            data: pet,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addPet = addPet;
const updatePet = async (req, res, next) => {
    try {
        const { id, userId, ...updateData } = req.body;
        const pet = await petModel_1.default.findOneAndUpdate({ _id: id, userId }, { $set: updateData }, { new: true });
        if (!pet) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.petNotFound });
        }
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.petUpdated,
            data: pet,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePet = updatePet;
const deletePet = async (req, res, next) => {
    try {
        const { id, userId } = req.body;
        const pet = await petModel_1.default.findById(id);
        if (!pet) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.petNotFound });
        }
        if (pet.userId.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ code: 403, message: message_1.ERROR_RESPONSE.unauthorizedAction });
        }
        await pet.deleteOne();
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.petDeleted,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePet = deletePet;
const getAllPets = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalPets = await petModel_1.default.countDocuments();
        const pets = await petModel_1.default.find().skip(skip).limit(limit);
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.petsFetched,
            data: {
                pets,
                pagination: {
                    totalPets,
                    currentPage: page,
                    totalPages: Math.ceil(totalPets / limit),
                    pageSize: limit,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPets = getAllPets;
const getPetsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const pets = await petModel_1.default.find({ userId });
        if (!pets.length) {
            return res
                .status(404)
                .json({ code: 404, message: message_1.ERROR_RESPONSE.noPetsFound });
        }
        return res.status(200).json({
            code: 200,
            message: message_1.SUCCESS_RESPONSE.petsFetched,
            data: pets,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPetsByUser = getPetsByUser;
//# sourceMappingURL=petController.js.map