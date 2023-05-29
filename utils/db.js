const config = require("dotenv").config;
const chalk = require("chalk");
const mongoose = require("mongoose");

config();

const connectDB = async () => {
  try {
    const db = process.env.MONGO_URL;
    await mongoose.connect(db);
    console.log(chalk.green(`Connected to ${db}`));
  } catch (err) {
    console.error(chalk.red(err));
  }
};

module.exports = connectDB;
