import  express, { Request, Response }  from "express";
import { bookingsService } from "./booking.service";

const router = express.Router()

router.post("/", bookingsService.createBooking)

router.get("/", bookingsService.getBookings)

// router.put("/:id", bookingsService.updateSingleBooking)

export const bookingRouter = router
