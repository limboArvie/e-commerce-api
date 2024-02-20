require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");

const port = 4000;
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

mongoose.connect(
  "",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB Database");
});

app.use("/users", userRoutes);

app.listen(process.env.PORT || port, () => {
  console.log(`API is now online on port ${process.env.PORT || port}`);
});

module.exports = { app, mongoose };
