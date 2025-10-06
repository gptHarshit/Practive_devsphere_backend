const validate = require("validator");
const User = require("../models/user");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("First name is required");
  } else if (!lastName) {
    throw new Error("Last name is required");
  } else if (firstName.length < 3 || firstName.length > 40) {
    throw new Error("Name should be of lenght 4-40");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }

  if (!/^[a-zA-Z\s]{2,40}$/.test(lastName)) {
    throw new Error(
      "Last name must be 2-40 characters long and contain only letters or spaces"
    );
  }

  if (!/^[a-zA-Z\s]{2,40}$/.test(firstName)) {
    throw new Error(
      "First name must be 2-40 characters long and contain only letters or spaces"
    );
  }
};

const validationforUpdatedata = async (req) => {
  const AllowedToUpdate = [
    "firstName",
    "lastName",
    "skills",
    "about",
    "photoUrl",
    "gender",
    "age",
    "projects",
    "certificates",
    "codingProfiles",
    "codingPlatforms",
    "contributions",
    "professionalStatus",
    "institution",
    "role",
    "portfolioLink",
  ];

  //console.log("🔍 Validation Check - Received fields:", Object.keys(req.body));
  //console.log("🔍 Validation Check - Allowed fields:", AllowedToUpdate);

  const isAllowedToUpdate = Object.keys(req.body).every((field) =>
    AllowedToUpdate.includes(field)
  );
  return isAllowedToUpdate;
};

const isValidUrl = (url) => {
  if (!url || url.trim() === "") return true;
  return validate.isURL(url, {
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ["http", "https"],
  });
};

const isValidGitHubUrl = (url) => {
  if (!url || url.trim() === "") return true;
  return url.includes("github.com") && isValidUrl(url);
};

const validateProfileData = (data) => {
  const errors = {};

  if (data.photoUrl && !isValidUrl(data.photoUrl)) {
    errors.photoUrl =
      "Profile photo URL must be a valid URL starting with http:// or https://";
  }

  if (data.portfolioLink && !isValidUrl(data.portfolioLink)) {
    errors.portfolioLink =
      "Portfolio link must be a valid URL starting with http:// or https://";
  }

  if (data.projects) {
    data.projects.forEach((project, index) => {
      if (project.githubLink && !isValidGitHubUrl(project.githubLink)) {
        errors[`projects[${index}].githubLink`] =
          "GitHub link must be a valid GitHub URL";
      }
      if (project.liveLink && !isValidUrl(project.liveLink)) {
        errors[`projects[${index}].liveLink`] =
          "Live demo link must be a valid URL";
      }
      if (project.image && !isValidUrl(project.image)) {
        errors[`projects[${index}].image`] =
          "Project image must be a valid URL";
      }
    });
  }

  if (data.certificates) {
    data.certificates.forEach((cert, index) => {
      if (cert.link && !isValidUrl(cert.link)) {
        errors[`certificates[${index}].link`] =
          "Certificate link must be a valid URL";
      }
    });
  }

  if (data.codingProfiles) {
    data.codingProfiles.forEach((profile, index) => {
      if (profile.profileUrl && !isValidUrl(profile.profileUrl)) {
        errors[`codingProfiles[${index}].profileUrl`] =
          "Profile URL must be a valid URL";
      }
    });
  }

  if (data.contributions) {
    data.contributions.forEach((contribution, index) => {
      if (contribution.projectLink && !isValidUrl(contribution.projectLink)) {
        errors[`contributions[${index}].projectLink`] =
          "Project link must be a valid URL";
      }
      if (
        contribution.certificateLink &&
        !isValidUrl(contribution.certificateLink)
      ) {
        errors[`contributions[${index}].certificateLink`] =
          "Certificate link must be a valid URL";
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateSignUpData,
  validationforUpdatedata,
  isValidUrl,
  isValidGitHubUrl,
  validateProfileData,
};
