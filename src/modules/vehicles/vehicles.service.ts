import { pool } from "../../config/db";

const createVehicles = async (payload: Record <string, unknown>) =>{
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;

    const result = await pool.query( 
        `INSERT INTO vehicles 
        (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )
    return result;
}

//all vehicles
const getVehicles = async () =>{
    const result = await pool.query(`SELECT * FROM vehicles`,[])
        return result;        
}

//single vehicles
const getSingleVehicles = async( id: string)=>{
    const result = await pool.query(`SELECT * FROM vehicles  WHERE 
        id =$1`, [id])
        return result;
}

//update single vehicles
 const updateVehicles = async (vehicle_name:string, type:string, registration_number:string, daily_rent_price:string, availability_status:string, id:string)=>{

        const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4,
             availability_status=$5 WHERE id=$6 RETURNING *`, 
                [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
            )
        return result;
    }

//delete single vehicles

const deleteVehicles = async (id: string)=>{
    // Check if vehicle has active bookings
    const activeBookings = await pool.query(
        `SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active' AND rent_end_date >= CURRENT_DATE`,
        [id]
    );

    if (activeBookings.rows.length > 0) {
        throw new Error('Cannot delete vehicle with active bookings');
    }

    const result = await pool.query(`DELETE FROM vehicles WHERE id= $1 RETURNING *`, [id]);
    return result;
}

export const vehiclesService ={
    createVehicles,
    getVehicles,
    getSingleVehicles,
    updateVehicles,
    deleteVehicles

}