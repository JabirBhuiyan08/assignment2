import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async(payload: Record <string, unknown>) => {
    const { name, email, password, phone, role} = payload;
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password as string, 10);
    // Default to 'user' if no role provided
    const userRole = (role as string) || 'user';

    const result = await pool.query(
    `INSERT INTO users( name, email, password, phone, role)
    VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, userRole]
    );
    return result;
}

const getUser = async() => {
    const result = await pool.query(`SELECT * FROM users`);
    return result
}

const deleteUser = async(id: string) => {
    const result = await pool.query( `DELETE FROM users WHERE id = $1`, [id])
    return result;
}

export const userServices = {
    createUser,
    getUser,
    deleteUser
}
