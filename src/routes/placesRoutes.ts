import express from "express";
import {
  addPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from "../controllers/placesControllers";

const router = express.Router();

router.post("/", addPlace);
router.get("/", getPlaces);
router.get("/:id", getPlaceById);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

export default router;
