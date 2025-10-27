import { Router } from "express";
import { addPetValidation, deletePetValidation, updatePetValidation } from "../validations/petValidation";
import { validateRequest } from "../validations/userValidation";
import {
  addPet,
  updatePet,
  deletePet,
  getAllPets,
  getPetsByUser,
} from "../controllers/petController";

const router = Router();

router.post("/add", validateRequest(addPetValidation), addPet);
router.put("/update", validateRequest(updatePetValidation), updatePet);
router.delete("/delete", validateRequest(deletePetValidation), deletePet);
router.get("/get-all", getAllPets);
router.get("/:userId", getPetsByUser);

export default router;
