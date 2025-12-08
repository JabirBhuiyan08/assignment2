import {Pool} from "pg"
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
})


const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id  SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(15),
      role VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(20) CHECK (type IN ('car','bike', 'van', 'SUV')) NOT NULL,
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price NUMERIC(10,2) CHECK (daily_rent_price > 0) NOT NULL,
            availability_status VARCHAR(20)
                CHECK (availability_status IN ('available', 'booked'))
                DEFAULT 'available',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW() 
        )
        `)

  await pool.query(`
      
      CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
      total_price NUMERIC(10, 2) CHECK (total_price > 0) NOT NULL,
      status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CHECK (rent_end_date > rent_start_date)
        )
      `)

}
export default initDB;