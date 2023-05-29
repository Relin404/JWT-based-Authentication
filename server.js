const chalk = require("chalk");
const config = require("dotenv").config;
const http = require("http");

config();

const app = require("./app");
const connectDB = require("./utils/db");

const server = http.createServer(app);
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(chalk.hex("#00FF00")`Server running on port ${port}...`);
    });
  } catch (err) {
    console.error(chalk.red(err));
  }
};

startServer();
