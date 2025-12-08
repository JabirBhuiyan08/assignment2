import { Request, Response } from "express"
import { bookingsService } from "./booking.service"


const createBooking =async (req: Request, res: Response) => {

  try {
    const result = await bookingsService.createBooking(req.body)
    res.status(200).json({
      succes: true,
      message: "Data inserted Successfully",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      succes: false,
      message: err.message
    })
  }
  console.log(req.body);

}

const getBookings = async (req: Request, res: Response) => {
  try {
    const result =await  bookingsService.getBookings()
    res.status(200).json({
      success: false,
      message: "Users Retrieved successfully",
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
    const result =await bookingsService.updateSingleBooking(customer_id,vehicle_id, rent_start_date,rent_end_date,total_price,status, req.params.id as string)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    } else {
      res.status(200).json({
        success: true,
        message: "User updated Successfully",
        data: result.rows[0],
      })
    }
    console.log(result.rows)

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
    updateSingleBooking
}