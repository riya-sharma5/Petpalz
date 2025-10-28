"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const placesControllers_1 = require("../controllers/placesControllers");
const router = express_1.default.Router();
router.post("/add-place", placesControllers_1.addPlace);
router.get("/get-places", placesControllers_1.getPlaces);
router.get("/:id", placesControllers_1.getPlaceById);
router.put("/:id", placesControllers_1.updatePlace);
router.delete("/:id", placesControllers_1.deletePlace);
exports.default = router;
//# sourceMappingURL=placesRoutes.js.map