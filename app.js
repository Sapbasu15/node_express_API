/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
if (process.env.NODE_ENV === "Test") {
  console.log("This is Test env");
  mongoose
    .connect("mongodb://localhost/bookAPI_Test", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(err => {});
} else {
  console.log("This is Prod env");
  mongoose.connect("mongodb://localhost/bookAPI", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const port = process.env.PORT || 3000;
const Book = require("./models/bookModel");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const bookRouter = require("./routes/bookRouter")(Book);

app.use("/api", bookRouter);

app.server = app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});

module.exports = app;
