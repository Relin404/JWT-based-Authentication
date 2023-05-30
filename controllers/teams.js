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

const sendInvitation = async (req, res) => {
  const teamId = req.params.id;
  const { email } = req.body;

  try {
    const member = await User.findOne({ email });

    if (!member)
      return res.status(404).json({
        status: "failed",
        message: "Member not found",
      });

    const team = await Team.findById(teamId);

    if (!team)
      return res.status(404).json({
        status: "failed",
        message: "Team not found",
      });

    const memberExist = team.members.find((item) => item.id === member.id);

    if (memberExist)
      return res.status(400).json({
        status: "failed",
        message: "Member is already in the team",
      });

    member.invitations.push(team.id);

    await member.save();

    return res.status(200).json({
      status: "success",
      data: `Invitation sent to ${member.email}`,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const user = await User.findById(req.user.id);
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        status: "failed",
        message: "Team not found",
      });
    }

    const memberExist = team.members.find((member) => member.id === user.id);

    if (memberExist) {
      return res.status(400).json({
        status: "failed",
        message: "Member is already a member of this group",
      });
    }

    const userDetail = {
      name: user.name || "",
      email: user.email,
      id: user.id,
      role: "member",
    };

    team.members.push(userDetail);
    const teamIndex = user.invitations.indexOf(team.id);
    user.invitations.splice(teamIndex, 1);
    user.teams.push(team.id);

    await user.save();
    await team.save();

    return res.status(200).json({
      status: "success",
      message: `Invitation to ${team.name} accepted`,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

module.exports = { createTeam, sendInvitation, acceptInvitation };
