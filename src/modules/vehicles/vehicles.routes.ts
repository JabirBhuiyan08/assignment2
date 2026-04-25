import express from "express"
import { vehiclesController } from "./vehicles.controller"
import auth from "../../middleware/auth"

const router = express.Router()

// Public: anyone can view vehicles
router.get("/vehicles", vehiclesController.getVehicles)
router.get("/vehicles/:vehicleId", vehiclesController.getSingleVehicles)

// Admin-only routes
router.post("/vehicles", auth("admin"), vehiclesController.createVehicles)
router.put("/vehicles/:vehicleId", auth("admin"), vehiclesController.updateVehicles)
router.delete("/vehicles/:vehicleId", auth("admin"), vehiclesController.deleteVehicles)

export const vehiclesRouter = router