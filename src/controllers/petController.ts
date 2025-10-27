import { Request, Response, NextFunction } from "express";
import petModel from "../models/petModel";
import { Gender, Species } from "../utils/enum";
import dotenv from "dotenv";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../utils/message";

dotenv.config();

export const addPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { petName, species, breed, gender, dateOfBirth, age, userId } =
      req.body;

    if (!Object.values(Gender).includes(gender)) {
      return res
        .status(400)
        .json({ code: 400, message: ERROR_RESPONSE.invalidInput });
    }

    if (!Object.values(Species).includes(species)) {
      return res
        .status(400)
        .json({ code: 400, message: ERROR_RESPONSE.invalidInput });
    }

    const pet = await petModel.create({
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
      message: SUCCESS_RESPONSE.petAdded,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, userId, ...updateData } = req.body;

    const pet = await petModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );

    if (!pet) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.petNotFound });
    }

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.petUpdated,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, userId } = req.body;

    const pet = await petModel.findById(id);
    if (!pet) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.petNotFound });
    }

    if (pet.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ code: 403, message: ERROR_RESPONSE.unauthorizedAction });
    }

    await pet.deleteOne();

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.petDeleted,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalPets = await petModel.countDocuments();
    const pets = await petModel.find().skip(skip).limit(limit);

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.petsFetched,
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
  } catch (error) {
    next(error);
  }
};

export const getPetsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const pets = await petModel.find({ userId });
    if (!pets.length) {
      return res
        .status(404)
        .json({ code: 404, message: ERROR_RESPONSE.noPetsFound });
    }

    return res.status(200).json({
      code: 200,
      message: SUCCESS_RESPONSE.petsFetched,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};
