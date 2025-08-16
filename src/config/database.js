const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://codehelp:WhoUzHIbC6bAQ6qe@cluster0.czv9bds.mongodb.net/"
  );
};

connectDB()
  .then(() => {
    console.log("Database Connection Established Successfully");
  })
  .catch(() => {
    console.log("Cannot Connect with database!!");
  });
 