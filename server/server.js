import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from './config/mongoDB.js';
import authRouter from './routes/authRoutes.js'

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API endpoints 
app.get("/", (req, res) => res.send("API WORKING FINE"));

app.use('/api/auth', authRouter)
// app.get("/favicon.ico", (req, res) => res.status(204).end());
app.listen(port, () => console.log(`Server started on the PORT ==> ${port}`));
