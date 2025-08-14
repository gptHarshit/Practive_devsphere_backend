const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("hello , i am first");
    next();
  },
  (req, res, next) => {
    console.log("hello , i am Second");
    next();
  },
  (req, res) => {
    console.log("hello , i am third");
    res.send("hello this is the response from third route handler");
  }
);

// app.get("/user1/:userId/:username/:userage", (req,res) => {
//     console.log(req.params);
//     res.send("data received successfully");
// })

// app.get("/user",(req,res) => {
//     res.send({firstName : "Keshav", LastName : "Gupta"});
// });

// app.delete("/user",(req,res) => {
//     res.send("Deleted Successfully");
// });

// app.post("/user",(req,res) => {
//     res.send("post call to user");
// });

// app.use("/robin",(req,res) => {
//     res.send("Hello from Robin");
// });

app.listen(3000, () => {
  console.log("Server is Successfully listening on PORT : 3000");
});
