import { readFile } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connect.js";
import Job from "./models/Job.js";

const start = async () => {
  try {
    // Connect the MongoDB
    await connectDB(process.env.MONGO_URI);
    // Deletes the existing data from the DB
    // -----
    // await Job.deleteMany();
    // -----
    // Reads the mock data from the json file in the root
    const mockProducts = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    );
    
    // Creates jobs from the Job Schema Model
    await Job.create(mockProducts);
    console.log("Success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
