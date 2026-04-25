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
    const result =await userServices.deleteUser(req.params.userId as string)

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

const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  const userId = req.params.userId;
  const requesterRole = req.user?.role;
  const requesterId = req.user?.id;

  try {
    // Check if user is updating their own record or is admin
    if (requesterRole !== 'admin' && requesterId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    // Check for existing email (except for current user)
    if (email) {
      const emailCheck = await pool.query(
        `SELECT id FROM users WHERE email = $1 AND id != $2`,
        [email, userId]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Admins can update role, users can only update their own profile details
    let updateFields = [];
    let values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    if (requesterRole === 'admin' && role !== undefined) {
      updateFields.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, name, email, phone, role, created_at, updated_at`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
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
    deleteUser,
    updateUser
}