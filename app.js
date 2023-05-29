const cors = require("cors");
const express = require("express");

const authRouter = require("./routes/auth");
const teamsRouter = require("./routes/teams");

const app = express();

// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSucessStatus: 200,
// };

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", authRouter);
app.use("/", teamsRouter);

module.exports = app;
