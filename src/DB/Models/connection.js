import mongoose from "mongoose";
import { DB_URL } from "../../config/config.service.js";
import  Chalk  from "chalk";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log(chalk.green("DB connected successfuly"));
  } catch (error) {
    console.log(chalk.red("DB connection Failed"));
  }
};
