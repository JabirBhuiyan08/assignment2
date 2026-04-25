import { Request, Response } from "express"
import { bookingsService } from "./booking.service"


const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;

    // Validate dates
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past"
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date"
      });
    }

    // Check vehicle exists and get daily rate
    const vehicle = await bookingsService.getSingleVehicle(vehicle_id);
    if (vehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    const vehicleData = vehicle.rows[0];

    // Check vehicle availability
    const isAvailable = await bookingsService.checkVehicleAvailability(
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is not available for the selected dates"
      });
    }

    // Calculate total price (daily rate × duration)
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = duration * parseFloat(vehicleData.daily_rent_price);

    // Customers can only create bookings for themselves
    const bookingData = {
      customer_id: userId,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status: 'active'
    };

    const result = await bookingsService.createBooking(bookingData);

    // Update vehicle status to 'booked'
    await bookingsService.updateVehicleAvailability(vehicle_id, 'booked');

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
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
    const { status } = req.body
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

      // Get booking details
      const booking = await bookingsService.getSingleBooking(bookingId);
      if (booking.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      const bookingData = booking.rows[0];
      const today = new Date();
      const startDate = new Date(bookingData.rent_start_date);

      if (userRole === 'admin') {
        // Admin can mark as returned to update vehicle to available
        if (status === 'returned') {
          const result = await bookingsService.markAsReturned(bookingId, bookingData.vehicle_id);
          return res.status(200).json({
            success: true,
            message: "Booking marked as returned, vehicle status updated to available",
            data: result.rows[0],
          });
        } else if (status === 'cancelled') {
          const result = await bookingsService.updateBookingStatus(bookingId, 'cancelled');
          return res.status(200).json({
            success: true,
            message: "Booking cancelled",
            data: result.rows[0],
          });
        } else if (status === 'active') {
          const result = await bookingsService.updateBookingStatus(bookingId, 'active');
          return res.status(200).json({
            success: true,
            message: "Booking status updated to active",
            data: result.rows[0],
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Invalid status for admin",
          });
        }
      } else {
        // Customer can only cancel booking (before start date)
        if (status === 'cancelled') {
          if (today >= startDate) {
            return res.status(400).json({
              success: false,
              message: "Cannot cancel booking after start date",
            });
          }
          const result = await bookingsService.updateBookingStatus(bookingId, 'cancelled');
          return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: result.rows[0],
          });
        } else {
          return res.status(403).json({
            success: false,
            message: "You can only cancel your bookings",
          });
        }
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
