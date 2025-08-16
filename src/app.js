const express = require("express");
const { connectDB } = require("./config/database");

const app = express();

connectDB()
  .then(() => {
    console.log("Database Connection Established Successfully");

    app.listen(3000, () => {
      console.log("Server is Successfully listening on PORT : 3000");
    });
  })
  .catch(() => {
    console.log("Cannot Connect with database!!");
  });
