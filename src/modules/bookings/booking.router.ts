import  express, { Request, Response }  from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router()

// All booking routes require authentication
router.get("/bookings", auth("admin", "user"), bookingController.getBookings)

router.put("/bookings/:bookingId", auth("admin", "user"), bookingController.updateSingleBooking)

router.post("/bookings", auth("user"), bookingController.createBooking)

router.delete("/bookings/:bookingId", auth("admin", "user"), bookingController.deleteSingleBooking)

export const bookingRouter = router
