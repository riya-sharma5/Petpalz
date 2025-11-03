import express from "express";
import {
  addPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
 
} from "../controllers/placesControllers";

const router = express.Router();

router.post("/add-place", addPlace);
router.get("/get-places", getPlaces);
router.get("/:id", getPlaceById);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

export default router;
