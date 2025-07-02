import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./src/DataBase/db.js";
import messageRoute from './src/routes/message.route.js'
import cookieParser from "cookie-parser";
import cors from 'cors';
import { app, server } from "./src/DataBase/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoute);

server.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
    connectDB();
});
