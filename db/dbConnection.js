import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.URI;

export async function connectToMongo() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB")
    } catch(error) {
        console.error("Connection to MongoDB failed", error)
    }
}