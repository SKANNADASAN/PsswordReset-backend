import express from "express";
import AppRoutes from "./routes/index.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()

const PORT = process.env.PORT

const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to Password Reset Backend');
  });

  app.use('/',AppRoutes)

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`))
