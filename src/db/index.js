import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
    try {
        let connectioninstance = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${DB_NAME}`)
        console.log(`MONGODB CONNECTED!! `);

    } catch (error) {
        console.log("ERROR:MongoDB is UNABLE to connect:"+ error)
        // throw error;
        process.exit(1);
    }
}

export default connectDB