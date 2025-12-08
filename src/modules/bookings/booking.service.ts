import { pool } from "../../config/db";


const createBooking= async(payload: Record<string, unknown>) =>{
    const {customer_id,vehicle_id, rent_start_date,rent_end_date,total_price,status} = payload;


     const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date,rent_end_date,total_price,status) VALUES($1 ,$2, $3, $4, $5,$6)
      RETURNING *`,
      [customer_id,vehicle_id, rent_start_date,rent_end_date,total_price,status]
    );
    return result;
};



const getBookings = async() =>{
    const result =  await pool.query(`SELECT * FROM bookings`);
    return result;
};


const updateSingleBooking = async(customer_id:string,vehicle_id:string, rent_start_date:string,rent_end_date:string,total_price:string,status:string, id:string)=>{
    const result = await pool.query(`UPDATE bookings SET customer_id=$1,vehicle_id=$2, rent_start_date=$3,rent_end_date=$4,total_price=$5,status=$6 WHERE id=$4 RETURNING *`,
      [customer_id,vehicle_id, rent_start_date,rent_end_date,total_price,status, id]);

      return result;
}

export const bookingsService ={
    createBooking,
    getBookings,
    updateSingleBooking
}