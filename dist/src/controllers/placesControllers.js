"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.getPlaceById = exports.getPlaces = exports.addPlace = void 0;
const placesModel_1 = __importDefault(require("../models/placesModel"));
const enum_1 = require("../utils/enum");
const message_1 = require("../utils/message");
const addPlace = async (req, res, next) => {
    try {
        const { name, type, description, address, coordinates, city, state, zipcode, image, specialDiscounts, } = req.body;
        if (!Object.values(enum_1.PlaceType).includes(type)) {
            return res.status(400).json({ message: message_1.ERROR_RESPONSE.invalidPlaceType });
        }
        const newPlace = await placesModel_1.default.create({
            name,
            type,
            description,
            address,
            city,
            state,
            coordinates,
            zipcode,
            image,
            specialDiscounts,
        });
        res
            .status(201)
            .json({ message: message_1.SUCCESS_RESPONSE.placeAdded, data: newPlace });
    }
    catch (error) {
        next(error);
    }
};
exports.addPlace = addPlace;
const getPlaces = async (req, res, next) => {
    try {
        const { type, search, page = "1", limit = "10" } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        let filter = {};
        if (type && Object.values(enum_1.PlaceType).includes(type)) {
            filter.type = type;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
            ];
        }
        const total = await placesModel_1.default.countDocuments(filter);
        const data = await placesModel_1.default
            .find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        res.status(200).json({
            message: message_1.SUCCESS_RESPONSE.placesFetched,
            // data: places,
            data: {
                total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
                data
            },
        });
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
            return res.status(404).json({ message: message_1.ERROR_RESPONSE.placeNotFound });
        res
            .status(200)
            .json({ message: message_1.SUCCESS_RESPONSE.placesFetched, data: place });
    }
    catch (error) {
        next(error);
    }
};
exports.getPlaceById = getPlaceById;
const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await placesModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updated)
            return res.status(404).json({ message: message_1.ERROR_RESPONSE.placeNotFound });
        res
            .status(200)
            .json({ message: message_1.SUCCESS_RESPONSE.placeUpdated, data: updated });
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
            return res.status(404).json({ message: message_1.ERROR_RESPONSE.placeNotFound });
        res.status(200).json({ message: message_1.SUCCESS_RESPONSE.placeDeleted });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePlace = deletePlace;
//# sourceMappingURL=placesControllers.js.map