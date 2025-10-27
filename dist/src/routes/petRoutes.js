"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petValidation_1 = require("../validations/petValidation");
const userValidation_1 = require("../validations/userValidation");
const petController_1 = require("../controllers/petController");
const router = (0, express_1.Router)();
router.post("/add", (0, userValidation_1.validateRequest)(petValidation_1.addPetValidation), petController_1.addPet);
router.put("/update", (0, userValidation_1.validateRequest)(petValidation_1.updatePetValidation), petController_1.updatePet);
router.delete("/delete", (0, userValidation_1.validateRequest)(petValidation_1.deletePetValidation), petController_1.deletePet);
router.get("/get-all", petController_1.getAllPets);
router.get("/:userId", petController_1.getPetsByUser);
exports.default = router;
//# sourceMappingURL=petRoutes.js.map