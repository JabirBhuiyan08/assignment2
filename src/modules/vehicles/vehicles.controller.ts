import { Request, Response } from "express"
import { vehiclesService } from "./vehicles.service"
import { pool } from "../../config/db"

const createVehicles = async (req: Request, res: Response)=>{
    try{
    const result = await vehiclesService.createVehicles(req.body)
        res.status(200).json({
            succes: true,
            message: "Data Inserted Successfully",
            data: result.rows[0]
        })
    }catch(err:any){
    res.status(500).json({
      succes: false,
      message: err.message
    })
    }
}

const getVehicles = async(req: Request, res: Response) =>{
    try{
        const result = await vehiclesService.getVehicles()
      res.status(200).json({
      success: true,
      message: "Vehicles Retrieved successfully",
      data: result.rows,

    })  
    }   
    catch(err: any){
    res.status(500).json({
    success: false,
    message: err.message,
    details: err,
    })
}
}

const getSingleVehicles = async (req: Request, res: Response) => {

  try {
    const result = await vehiclesService.getSingleVehicles(req.params.vehicleId as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle fetched Successfully",
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

const updateVehicles = async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body
  try {
    const result =await vehiclesService.updateVehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status,req.params.vehicleId as string)

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      })
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated Successfully",
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

    const deleteVehicles =async (req: Request, res: Response) => {
  try {
    const result =await vehiclesService.deleteVehicles(req.params.vehicleId as string)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle Deleted Successfully",
      data: result.rows[0],
    });
      } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}

export const vehiclesController = {
    createVehicles,
    getVehicles,
    getSingleVehicles,
    updateVehicles,
    deleteVehicles
}