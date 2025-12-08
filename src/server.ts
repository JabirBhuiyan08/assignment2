import express, { NextFunction, Request, Response } from "express";
import initDB, { pool } from "./config/db";
import config from "./config";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehiclesRouter } from "./modules/vehicles/vehicles.routes";



const app = express()
const port = config.port;

app.use(express.json())

//initializing DB
initDB()


app.get('/', logger, (req: Request, res: Response) => {
  res.send('Working !')
})

//users part
app.use("/api/v1/auth/", userRoutes )

app.use("/api/v1", vehiclesRouter )

app.use("/api/v1",)

app.use((req, res)=>{
  res.status(404).json({
    success:false,
    message:"Route not Found",
    path: req.path,
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
