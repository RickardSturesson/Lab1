import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectToMongo } from "./db/dbConnection.js";

dotenv.config();
const app = express();

connectToMongo();

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Seriver listen to http://localhost:${port}/`)
});