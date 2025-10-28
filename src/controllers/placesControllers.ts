import { Request, Response, NextFunction } from "express";
import placeModel from "../models/placesModel";
import { PlaceType } from "../utils/enum";

export const addPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, description, address, latitude, longitude, image, specialDiscounts } = req.body;

    if (!Object.values(PlaceType).includes(type)) {
      return res.status(400).json({ message: "Invalid place type. Must be 'hospital' or 'petshop'." });
    }

    const newPlace = await placeModel.create({
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
  } catch (error) {
    next(error);
  }
};


export const getPlaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;

    let filter: any = {};
    if (type && Object.values(PlaceType).includes(type as PlaceType)) {
      filter.type = type;
    }

    const places = await placeModel.find(filter);
    res.status(200).json({ message: "Places fetched successfully", data: places });
  } catch (error) {
    next(error);
  }
};

export const getPlaceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const place = await placeModel.findById(id);
    if (!place) return res.status(404).json({ message: "Place not found" });

    res.status(200).json({ message: "Place fetched successfully", data: place });
  } catch (error) {
    next(error);
  }
};

export const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await placeModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Place not found" });

    res.status(200).json({ message: "Place updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
};

export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await placeModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Place not found" });

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    next(error);
  }
};
