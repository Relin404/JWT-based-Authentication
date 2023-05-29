// const asyncWrapper = require('../middlewares/asyncWrapper')
const Team = require("../models/team");
const User = require("../models/user");

const createTeam = async (req, res) => {
  const reqBody = {
    name: req.body.name,
    // we stored this user's data on the req object inside the middleware we created
    userId: req.user.id,
  };

  try {
    // On first creating a team
    // -> immediately add the creator of the team as an admin
    const user = req.user;
    const team = await Team.create(reqBody);
    const memberDetail = {
      name: user.name || "",
      email: user.email,
      id: req.user.id,
      role: "admin",
    };
    // Push this member detail inside the member array on the team model
    team.members.push(memberDetail);
    // Push the team id into the team array on the user model
    user.teams.push(user.id);

    await team.save();
    await user.save();

    return res.status(201).json({
      status: "success",
      data: team,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = { createTeam };
