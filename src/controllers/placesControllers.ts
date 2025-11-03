import { Request, Response, NextFunction } from "express";
import placeModel from "../models/placesModel";
import { PlaceType } from "../utils/enum";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";

export const addPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      type,
      description,
      address,
      coordinates,
      city,
      state,
      zipcode,
      image,
      specialDiscounts,
    } = req.body;

    if (!Object.values(PlaceType).includes(type)) {
      return res.status(400).json({ message: ERROR_RESPONSE.invalidPlaceType });
    }

    const newPlace = await placeModel.create({
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
      .json({ message: SUCCESS_RESPONSE.placeAdded, data: newPlace });
  } catch (error) {
    next(error);
  }
};

export const getPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, search, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    let filter: any = {};

    if (type && Object.values(PlaceType).includes(type as PlaceType)) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const total = await placeModel.countDocuments(filter);

    const data = await placeModel
      .find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      message: SUCCESS_RESPONSE.placesFetched,
     // data: places,
      data: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
        data
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const place = await placeModel.findById(id);
    if (!place)
      return res.status(404).json({ message: ERROR_RESPONSE.placeNotFound });

    res
      .status(200)
      .json({ message: SUCCESS_RESPONSE.placesFetched, data: place });
  } catch (error) {
    next(error);
  }
};

export const updatePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updated = await placeModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: ERROR_RESPONSE.placeNotFound });

    res
      .status(200)
      .json({ message: SUCCESS_RESPONSE.placeUpdated, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await placeModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: ERROR_RESPONSE.placeNotFound });

    res.status(200).json({ message: SUCCESS_RESPONSE.placeDeleted });
  } catch (error) {
    next(error);
  }
};
