const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http").Server(app);
const path = require("path");

// Get error controller
const errorController = require("./helper/errorController");

// cors configurations
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

//App route
const userRoute = require("./routes/app");
app.use("/api/user", userRoute);

// Error handling middleware
app.use(errorController);

// Define static files
app.use("/public", express.static(path.join(__dirname, "./public/images/")));
app.use("/userprofileimg", express.static(path.join(__dirname, "./public/userprofileimg/")));
app.use("/showcaseimg", express.static(path.join(__dirname, "./public/showcaseimg/")));
app.use("/serviceimg", express.static(path.join(__dirname, "./public/serviceimg/")));
app.use("/addonsimg", express.static(path.join(__dirname, "./public/addonsimg/")));
app.use("/appsettingimg", express.static(path.join(__dirname, "./public/appsettingimg/")));
app.use("/blogimg", express.static(path.join(__dirname, "./public/blogimg/")));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", function () {
  console.log("Connected Successfully");
});

// var server = app.listen(5000);
const port = process.env.PORT || 5055;
http.listen(port, () => console.log(`http://localhost:${port}`));
