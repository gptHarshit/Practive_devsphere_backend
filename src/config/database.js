const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://codehelp:WhoUzHIbC6bAQ6qe@cluster0.czv9bds.mongodb.net/"
  );
};

module.exports = {
    connectDB,
}


 