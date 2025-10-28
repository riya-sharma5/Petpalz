"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.getPlaceById = exports.getPlaces = exports.addPlace = void 0;
const placesModel_1 = __importDefault(require("../models/placesModel"));
const enum_1 = require("../utils/enum");
const addPlace = async (req, res, next) => {
    try {
        const { name, type, description, address, latitude, longitude, image, specialDiscounts } = req.body;
        if (!Object.values(enum_1.PlaceType).includes(type)) {
            return res.status(400).json({ message: "Invalid place type. Must be 'hospital' or 'petshop'." });
        }
        const newPlace = await placesModel_1.default.create({
            name,
            type,
            description,
            address,
            latitude,
            longitude,
            image,
            specialDiscounts,
        });
        res.status(201).json({ message: "Place added successfully", data: newPlace });
    }
    catch (error) {
        next(error);
    }
};
exports.addPlace = addPlace;
const getPlaces = async (req, res, next) => {
    try {
        const { type } = req.query;
        let filter = {};
        if (type && Object.values(enum_1.PlaceType).includes(type)) {
            filter.type = type;
        }
        const places = await placesModel_1.default.find(filter);
        res.status(200).json({ message: "Places fetched successfully", data: places });
    }
    catch (error) {
        next(error);
    }
};
exports.getPlaces = getPlaces;
const getPlaceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await placesModel_1.default.findById(id);
        if (!place)
            return res.status(404).json({ message: "Place not found" });
        res.status(200).json({ message: "Place fetched successfully", data: place });
    }
    catch (error) {
        next(error);
    }
};
exports.getPlaceById = getPlaceById;
const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await placesModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ message: "Place not found" });
        res.status(200).json({ message: "Place updated successfully", data: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePlace = updatePlace;
const deletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await placesModel_1.default.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ message: "Place not found" });
        res.status(200).json({ message: "Place deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePlace = deletePlace;
//# sourceMappingURL=placesControllers.js.map