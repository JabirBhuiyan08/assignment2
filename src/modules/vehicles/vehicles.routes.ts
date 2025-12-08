import express from "express"
import { vehiclesController } from "./vehicles.controller"

const router = express.Router()
 
//upload vehicles
router.post("/vehicles", vehiclesController.createVehicles)

export const vehiclesRouter = router