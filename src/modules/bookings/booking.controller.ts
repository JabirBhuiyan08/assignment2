import { Request, Response } from "express"
import { bookingsService } from "./booking.service"


const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Customers can only create bookings for themselves
    const bookingData = {
      ...req.body,
      customer_id: userId,
    };

    const result = await bookingsService.createBooking(bookingData)
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0]
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

const getBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    let result;
    if (userRole === 'admin') {
      result = await bookingsService.getBookings()
    } else {
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }
      result = await bookingsService.getCustomerBookings(userId)
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
}

const updateSingleBooking = async (req: Request, res: Response) => {
    const {customer_id,vehicle_id, rent_start_date,rent_end_date,total_price,status} = req.body
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      const bookingId = req.params.bookingId as string;

    // Check ownership (admin bypasses this check)
    if (userRole !== 'admin' && userId) {
      const isOwner = await bookingsService.isBookingOwner(bookingId, userId);
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own bookings"
        });
      }
    }

    const result =await bookingsService.updateSingleBooking(customer_id,vehicle_id, rent_start_date,rent_end_date,total_price,status, bookingId)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        data: result.rows[0],
      })
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
}

const deleteSingleBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const bookingId = req.params.bookingId as string;

    // Check ownership (admin bypasses this check)
    if (userRole !== 'admin' && userId) {
      const isOwner = await bookingsService.isBookingOwner(bookingId, userId);
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own bookings"
        });
      }
    }

    const result = await bookingsService.deleteSingleBooking(bookingId)

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
  }
}

export const bookingController ={
    createBooking,
    getBookings,
    updateSingleBooking,
    deleteSingleBooking
}
