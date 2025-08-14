const express = require("express");

const app = express();









// app.use("/", (req, res, next) => {
//   next();
// });
// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("Middleware 1");
//     next();
//   },
//   (req, res,next) => {
//     console.log("Middleware 2");
//    // res.send("done");
//    next();
//   }
// );
// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("Middleware 1");
//     next();
//   },
//   (req, res) => {
//     console.log("Middleware 2");
//     res.send("done");
//   }
// );



// app.get("/user1",(req,res)=>{
//     console.log("Middleware 3");
//     res.send("finally reached");
// });

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("hello , i am first");
//     next();
//   }
// );
// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("hello , i am first");
//     res.send("done");
//   }
// );

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
