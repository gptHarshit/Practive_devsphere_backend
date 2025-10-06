const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: isURL } = require("validator/lib/isURL");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong password");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.pngarts.com/files/3/Avatar-Free-PNG-Image.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("photoUrl is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of the user",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length >= 7) {
          throw new Error("You can add atmost 6 skills");
        }
      },
    },
    professionalStatus: {
      type: String,
      enum: ["student", "working"],
      default: "student",
      required: true,
    },
    institution: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    portfolioLink: {
      type: String,
      default: "",
      validate(value) {
        if (!value || value.trim() === "") return true; // Empty allowed

        if (
          !validator.isURL(value, {
            require_protocol: true, // Force http:// or https://
            require_valid_protocol: true,
          })
        ) {
          throw new Error("Portfolio link must start with http:// or https://");
        }
      },
    },
    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        techStack: [
          {
            type: String,
            trim: true,
            default: [],
          },
        ],
        githubLink: {
          type: String,
          default: "",
        },
        liveLink: {
          type: String,
          default: "",
          validate(value) {
            if (!value || value.trim() === "") {
              return true;
            }
            if (!validator.isURL(value)) {
              throw new Error("Live demo link is not valid");
            }
            return true;
          },
        },
        image: {
          type: String,
          default: "",
          validate(value) {
            if (typeof value !== "string") return false;
            if (value.trim() === "") return true; 
            if (
              !validator.isURL(value, {
                require_protocol: true,
                require_valid_protocol: true,
              })
            ) {
              throw new Error("Project image URL is not valid");
            }
            return true;
          },
        },
      },
    ],

    certificates: [
      {
        name: {
          type: String,
          required: true,
        },
        issuingOrg: {
          type: String,
          default: "",
        },
        issueDate: {
          type: Date,
        },
        link: {
          type: String,
          validate(value) {
            if (value && !validator.isURL(value)) {
              throw new Error("Certificate link is not valid");
            }
          },
        },
      },
    ],

    codingProfiles: [
      {
        platform: {
          type: String,
          required: true,
        },
        profileUrl: {
          type: String,
          required: true,
          validate(value) {
            if (!validator.isURL(value)) {
              throw new Error("Profile URL is not valid");
            }
          },
        },
        username: {
          type: String,
          default: "",
        },
        rating: {
          type: String,
          default: "",
        },
      },
    ],

    codingPlatforms: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert", ""],
          default: "",
        },
      },
    ],

    contributions: [
      {
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: ["Hackathon", "Open Source", "Community", "Volunteer", "Other"],
        },
        organization: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        role: {
          type: String,
          default: "",
        },
        projectLink: {
          type: String,
          validate(value) {
            if (value && !validator.isURL(value)) {
              throw new Error("Project link is not valid");
            }
          },
        },
        certificateLink: {
          type: String,
          validate(value) {
            if (value && !validator.isURL(value)) {
              throw new Error("Certificate link is not valid");
            }
          },
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@22$", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordSavedInDBAlready = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordSavedInDBAlready
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
