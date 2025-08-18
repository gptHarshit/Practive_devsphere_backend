const validate = require("validator");

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
    throw new Error("Last name must be 2-40 characters long and contain only letters or spaces");
  }

  if (!/^[a-zA-Z\s]{2,40}$/.test(firstName)) {
    throw new Error("First name must be 2-40 characters long and contain only letters or spaces");
  }
};

module.exports = {
  validateSignUpData,
};
