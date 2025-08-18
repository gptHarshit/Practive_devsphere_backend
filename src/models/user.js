const mongoose = require("mongoose");
const validator = require("validator");
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
      default:
        "https://templates.joomla-monster.com/joomla30/jm-news-portal/components/com_djclassifieds/assets/images/default_profile.png",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
