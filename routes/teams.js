const express = require("express");

const authMiddleware = require("../middlewares/auth");
const {
  createTeam,
  sendInvitation,
  acceptInvitation,
} = require("../controllers/teams");

const router = express.Router();

router.post("/teams", authMiddleware, createTeam);
router.post("/send-invitation/:id", authMiddleware, sendInvitation);
router.post("/accept-invitation/:teamId", authMiddleware, acceptInvitation);

module.exports = router;
