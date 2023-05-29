const express = require("express");

const authMiddleware = require("../middlewares/auth");
const { createTeam } = require("../controllers/teams");

const router = express.Router();

router.post("/teams", authMiddleware, createTeam);

module.exports = router;
