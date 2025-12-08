import { Request, Response } from "express";
import { userServices } from "./user.service";
import { pool } from "../../config/db";


const createUser = async (req: Request, res: Response) =>{
    console.log(req.body)
    try{
        const result = await userServices.createUser(req.body)
        console.log(req.body)
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: result
        })
    }catch(err: any){
    res.status(500).json({
    succes: false,
    message: err.message
    })
    }
}

const getUser = async (req: Request, res: Response)=>{
    try{
        const result = await userServices.getUser()
        res.status(200).json({
            success: true,
            message: "User Retrieved Successfully",
            data: result.rows
        })

    }catch(err: any){
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    })
    }
}

const deleteUser = async (req:Request , res: Response)=>{
      try {
    const result =await userServices.deleteUser(req.params.id as string)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
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
export const userControllers = {
    createUser,
    getUser,
    deleteUser
}