const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validationforUpdatedata } = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
//   try {
//     if (!validationforUpdatedata(req)) {
//       throw new Error("Invalid Edit Request");
//     }
//     const loggedInUser = req.user;
//     Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
//     await loggedInUser.save();
//     res.json({
//       message: `${loggedInUser.firstName}, your profile has updated successfully`,
//       data: loggedInUser,
//     });
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// });

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
   
    if (!validationforUpdatedata(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile has updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.put("/profile/remove-project", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.body;

    // console.log(" Removing project ID:", projectId);

    const user = await User.findById(userId);
   // console.log("Projects before removal:", user.projects.length);
    const updatedProjects = user.projects.filter((project) => {
      const isMatch =
        project._id.toString() === projectId ||
        (project.id && project.id.toString() === projectId.toString());
      return !isMatch;
    });

    //console.log(" Projects after removal:", updatedProjects.length);

    user.projects = updatedProjects;
    await user.save();

    res.json({
      success: true,
      message: "Project removed successfully",
      user: user,
    });
  } catch (error) {
    console.error("Remove project error:", error);
    res
      .status(500)
      .json({ error: "Failed to remove project: " + error.message });
  }
});

profileRouter.put("/profile/remove-certificate", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { certificateId } = req.body;

    const user = await User.findById(userId);
    const updatedCertificates = user.certificates.filter(
      (cert) =>
        cert._id.toString() !== certificateId &&
        cert.id &&
        cert.id.toString() !== certificateId.toString()
    );

    user.certificates = updatedCertificates;
    await user.save();

    res.json({
      success: true,
      message: "Certificate removed successfully",
      user: user,
    });
  } catch (error) {
    console.error("Remove certificate error:", error);
    res
      .status(500)
      .json({ error: "Failed to remove certificate: " + error.message });
  }
});

profileRouter.put(
  "/profile/remove-coding-profile",
  userAuth,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { profileId } = req.body;

      const user = await User.findById(userId);
      const updatedProfiles = user.codingProfiles.filter(
        (profile) =>
          profile._id.toString() !== profileId &&
          profile.id &&
          profile.id.toString() !== profileId.toString()
      );

      user.codingProfiles = updatedProfiles;
      await user.save();

      res.json({
        success: true,
        message: "Coding profile removed successfully",
        user: user,
      });
    } catch (error) {
      console.error("Remove coding profile error:", error);
      res
        .status(500)
        .json({ error: "Failed to remove coding profile: " + error.message });
    }
  }
);

profileRouter.put("/profile/remove-skill", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { skillId } = req.body;

    const user = await User.findById(userId);
    const updatedSkills = user.codingPlatforms.filter(
      (skill) =>
        skill._id.toString() !== skillId &&
        skill.id &&
        skill.id.toString() !== skillId.toString()
    );

    user.codingPlatforms = updatedSkills;
    await user.save();

    res.json({
      success: true,
      message: "Skill removed successfully",
      user: user,
    });
  } catch (error) {
    console.error("Remove skill error:", error);
    res.status(500).json({ error: "Failed to remove skill: " + error.message });
  }
});

profileRouter.put(
  "/profile/remove-contribution",
  userAuth,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { contributionId } = req.body;

      const user = await User.findById(userId);
      const updatedContributions = user.contributions.filter(
        (contribution) =>
          contribution._id.toString() !== contributionId &&
          contribution.id &&
          contribution.id.toString() !== contributionId.toString()
      );

      user.contributions = updatedContributions;
      await user.save();

      res.json({
        success: true,
        message: "Contribution removed successfully",
        user: user,
      });
    } catch (error) {
      console.error("Remove contribution error:", error);
      res
        .status(500)
        .json({ error: "Failed to remove contribution: " + error.message });
    }
  }
);

module.exports = profileRouter;
